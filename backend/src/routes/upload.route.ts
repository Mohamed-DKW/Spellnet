import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../db';
import fs from 'fs';
import { authMiddleware, AuthRequest } from '../middleware/logger';
import { RAGService } from '../services/rag.service';
import { WebSearchService } from '../services/webSearch.service';

const router = express.Router();
const ragService = new RAGService();
const webSearchService = new WebSearchService();

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
    dest: uploadDir,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|txt|md|json/;
        const ext = path.extname(file.originalname).toLowerCase().substring(1);
        allowedTypes.test(ext) ? cb(null, true) : cb(new Error('Tipo no permitido'));
    }
});

const abortControllers = new Map<number, AbortController>();

async function fetchWithRetry(
    url: string,
    options: RequestInit & { timeout?: number },
    retries = 3,
    delay = 1000
): Promise<Response> {
    const { timeout = 600000, ...fetchOptions } = options;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response;
        } catch (err: any) {
            console.warn(`Intento ${attempt} fallido para ${url}:`, err.message);
            if (attempt === retries) throw err;
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
    throw new Error('No se pudo conectar con Ollama después de varios intentos');
}

async function checkOllamaHealth(): Promise<boolean> {
    try {
        const res = await fetchWithRetry('http://127.0.0.1:11434/api/tags', {
            method: 'GET',
            timeout: 10000,
        }, 2, 500);
        return res.ok;
    } catch {
        return false;
    }
}

async function callOllamaWithRetry(prompt: string, model: string): Promise<Response> {
    const url = 'http://127.0.0.1:11434/api/generate';
    const body = JSON.stringify({
        model,
        prompt,
        stream: true,
        options: { temperature: 0.7, num_predict: 500 }
    });
    return fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        timeout: 600000,
    }, 3, 2000);
}

function extractName(text: string): string | null {
    const patterns = [
        /mi nombre es (\w+)/i,
        /me llamo (\w+)/i,
        /soy (\w+)/i,
        /nombre:?\s*(\w+)/i
    ];
    for (const p of patterns) {
        const m = text.match(p);
        if (m) return m[1];
    }
    return null;
}

function isAskingName(text: string): boolean {
    return /(cual es mi nombre|como me llamo|quien soy|dime mi nombre)/i.test(text);
}

function needsWebSearch(text: string, hasFilesInChat: boolean): boolean {
    if (hasFilesInChat) return false;
    const lower = text.toLowerCase();
    const explicitSearchPhrases = [
        'busca en internet', 'búscame', 'encuentra en la web', 'buscar en google',
        'search online', 'look up', 'find on the web', 'investiga sobre',
        'qué dice internet sobre', 'consulta en la web', 'buscar en la web',
        'búscalo en internet', 'buscar en línea', 'busca online'
    ];
    return explicitSearchPhrases.some(phrase => lower.includes(phrase));
}

function extractNumericValue(text: string, query: string): string | null {
    const patterns = [
        /(\d+(?:[.,]\d+)?)\s*(?:dólares?|euros?|pesos?|usd|mxn|eur|bitcoin|btc)/i,
        /(?:dólar|euro|peso|bitcoin)\s*(?:está|vale|cuesta)\s*(?:en\s+)?(\d+(?:[.,]\d+)?)/i,
        /\b(\d+(?:[.,]\d+)?)\b(?=\s*(?:dólares|euros|pesos|usd|mxn|eur|btc))/i
    ];
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            let num = match[1].replace(',', '.');
            if (!isNaN(parseFloat(num))) return num;
        }
    }
    return null;
}

async function generateChatTitle(message: string): Promise<string> {
    const model = process.env.OLLAMA_MODEL || 'gemma2:2b';
    const prompt = `Responde SOLO con un título corto (máximo 6 palabras) para este mensaje. No añadas explicaciones. Título: "${message}"`;
    try {
        const res = await fetchWithRetry('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, prompt, stream: false, options: { temperature: 0.3, num_predict: 20 } }),
            timeout: 15000,
        }, 2, 1000);
        const data = await res.json() as { response: string };
        let title = data.response.trim().replace(/^["']|["']$/g, '');
        if (title.length > 50) title = title.slice(0, 47) + '…';
        return title || 'Nuevo conjuro';
    } catch {
        return 'Nuevo conjuro';
    }
}

async function extractFileStats(filePath: string, fileName: string): Promise<{ text: string; size: number; lines: number; words: number }> {
    let text = '';
    const ext = path.extname(fileName).toLowerCase();
    if (ext === '.txt' || ext === '.md') {
        text = fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.pdf') {
        const pdfParse = require('pdf-parse');
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        text = data.text;
    } else if (ext === '.docx') {
        const mammoth = require('mammoth');
        const buffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
    } else {
        text = `[Tipo de archivo no soportado: ${fileName}]`;
    }
    const size = fs.statSync(filePath).size;
    const lines = text.split('\n').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    return { text, size, lines, words };
}

async function searchWithTimeout(query: string, maxResults: number = 3): Promise<Awaited<ReturnType<typeof webSearchService.search>>> {
    const timeoutPromise = new Promise<[]>((_, reject) =>
        setTimeout(() => reject(new Error('Web search timeout after 25s')), 25000)
    );
    const searchPromise = webSearchService.search(query, maxResults);
    return Promise.race([searchPromise, timeoutPromise]) as any;
}

router.post('/', authMiddleware, upload.array('files'), async (req: AuthRequest, res) => {
    try {
        const { message, chat_id } = req.body;
        const files = req.files as Express.Multer.File[];
        const user_id = req.userId!;
        const io = req.app.get('io');

        console.log(`[UPLOAD] Mensaje: "${message}" - Chat: ${chat_id}`);

        if (!chat_id) return res.status(400).json({ error: 'chat_id requerido' });

        const ollamaOk = await checkOllamaHealth();
        if (!ollamaOk) {
            return res.status(503).json({ error: 'El oráculo no está disponible' });
        }

        const user = await db('user').where({ user_id }).first();
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const plan_id = user.plan_id;

        const [userMsgId] = await db('message').insert({
            content: message || 'Vacío',
            chat_id: parseInt(chat_id),
            user_id,
            plan_id,
            date: new Date()
        });

        const fileRecords: { id: number; name: string; size: number; lines: number; words: number }[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const { text, size, lines, words } = await extractFileStats(file.path, file.originalname);
                const [fileId] = await db('file').insert({
                    name: file.originalname,
                    path: file.path.replace(/\\/g, '/'),
                    user_id,
                    message_id: userMsgId,
                    plan_id,
                    content: text
                });
                fileRecords.push({ id: fileId, name: file.originalname, size, lines, words });
                (async () => {
                    try {
                        await ragService.processDocument(file.path, file.originalname, fileId, text);
                    } catch (e) { console.error(`RAG error: ${e}`); }
                })();
            }
        }

        const [responseId] = await db('response_ia').insert({
            reply: '',
            date: new Date(),
            chat_id: parseInt(chat_id)
        });

        res.json({
            success: true,
            messageId: userMsgId,
            responseId,
            reply: '',
            files: fileRecords,
        });

        const room = `chat-${chat_id}`;
        const numericChatId = parseInt(chat_id, 10);

        io.to(room).emit('assistant:prepare', { chatId: numericChatId, responseId });

        const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const allFileIds = await ragService.getAllFileIdsInChat(parseInt(chat_id));
        const hasAnyFile = allFileIds.length > 0;

        let fileContext = '';
        if (hasAnyFile) {
            const relevantChunks = await ragService.searchRelevantInChat(parseInt(chat_id), message || '', 5);
            if (relevantChunks.length > 0) {
                fileContext = '## Contenido relevante de tus archivos (RESPONDE EXCLUSIVAMENTE CON ESTA INFORMACIÓN, NO BUSQUES EN INTERNET):\n' + relevantChunks.map(c => c.pageContent).join('\n\n');
            } else {
                const allFilesContent = await db('file')
                    .join('message', 'file.message_id', 'message.message_id')
                    .where('message.chat_id', parseInt(chat_id))
                    .select('file.content', 'file.name');
                const aggregated = allFilesContent.map(f => `--- ${f.name} ---\n${f.content?.slice(0, 3000) || ''}`).join('\n\n');
                if (aggregated) {
                    fileContext = '## Contenido de tus archivos (usa esta información para responder):\n' + aggregated.slice(0, 8000);
                }
            }
        }

        let webResults: Awaited<ReturnType<typeof webSearchService.search>> = [];
        let webSearchPerformed = false;
        let extractedValue: string | null = null;

        const needsWeb = needsWebSearch(message || '', hasAnyFile);
        console.log(`[UPLOAD] needsWebSearch: ${needsWeb}, hasAnyFile: ${hasAnyFile}`);

        if (needsWeb) {
            webSearchPerformed = true;
            io.to(room).emit('search:start', { chatId: numericChatId });
            try {
                webResults = await searchWithTimeout(message || '', 3);
                console.log(`[UPLOAD] Web results: ${webResults.length} encontrados`);
                for (const wr of webResults) {
                    let domain = '';
                    try { domain = new URL(wr.url).hostname; } catch { domain = wr.url.split('/')[2] || ''; }
                    io.to(room).emit('search:result', { title: wr.title, url: wr.url, domain, chatId: numericChatId });
                }
                if (webResults.length > 0) {
                    const fullText = webResults.map(r => r.content).join(' ');
                    extractedValue = extractNumericValue(fullText, message || '');
                }
            } catch (e) {
                console.error('Error en búsqueda web:', e);
                io.to(room).emit('search:error', { chatId: numericChatId, error: 'Búsqueda lenta o fallida' });
            }
        }

        let systemInstruction = `Eres un asistente experto. Responde directamente y sin usar placeholders como [insertar...] o [temperatura]. Usa números y datos reales.

- Usa **negritas** para enfatizar.
- Usa *cursivas* para términos especiales.
- Para listas, usa - o 1.
- Si incluyes enlaces, ponlos como [texto](url).
- NUNCA muestres los símbolos crudos del markdown (como ** o *), deben ser interpretados.`;

        let prompt = `${systemInstruction}

## Contexto temporal
Fecha actual: ${today}.

${fileContext ? fileContext + '\n' : ''}

${!hasAnyFile && webResults.length > 0 ? `## Resultados de búsqueda web (INFORMACIÓN ACTUALIZADA)
${webResults.map(r => `- ${r.content}`).join('\n\n')}` : ''}

${extractedValue ? `## Dato extraído: ${extractedValue}` : ''}

## Pregunta del usuario
${message}

## Instrucción OBLIGATORIA
${hasAnyFile ? 'RESPONDE EXCLUSIVAMENTE CON LA INFORMACIÓN DE "## Contenido de tus archivos". NO BUSQUES EN INTERNET. NO INVENTES DATOS. Usa formato Markdown.' :
                webResults.length > 0 ? 'USA los resultados de búsqueda para responder con los datos más actuales. OBLIGATORIAMENTE incluye los enlaces de las fuentes. NO USES PLACEHOLDERS como [insertar].' :
                    'Responde con tus conocimientos generales. Si no sabes algo, dilo claramente. NO uses placeholders.'}`;

        if (isAskingName(message || '')) {
            const userName = extractName(message || '');
            prompt = userName ? `Responde amablemente en Markdown: "¡Claro, **${userName}**! Es un placer ayudarte."` : `Pregunta cortésmente su nombre.`;
        }

        const model = process.env.OLLAMA_MODEL || 'gemma2:2b';
        let fullReply = '';
        let firstTokenSent = false;

        const abortController = new AbortController();
        abortControllers.set(responseId, abortController);

        try {
            const ollamaRes = await callOllamaWithRetry(prompt, model);
            if (!ollamaRes.body) throw new Error('No response body');
            const reader = ollamaRes.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            while (true) {
                if (abortController.signal.aborted) break;
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    try {
                        const data = JSON.parse(trimmed);
                        const token = data.response || '';
                        if (token) {
                            if (!firstTokenSent) {
                                firstTokenSent = true;
                                io.to(room).emit('assistant:start', { chatId: numericChatId, responseId });
                            }
                            fullReply += token;
                            io.to(room).emit('assistant:token', { chatId: numericChatId, responseId, token });
                        }
                    } catch (e) { }
                }
            }
            fullReply = fullReply.trim() || 'No pude generar respuesta.';

            // Limpiar placeholders residuales
            fullReply = fullReply.replace(/\[inserta[^\]]*\]/gi, '[dato no disponible]');
            fullReply = fullReply.replace(/\[temperatura\]/gi, '[dato no disponible]');
            fullReply = fullReply.replace(/\[precio\]/gi, '[dato no disponible]');

            // ✅ Añadir bloque de fuentes si hay resultados de búsqueda web
            if (webResults.length > 0 && !hasAnyFile) {
                // Verificar si ya existe un bloque de fuentes (para no duplicar)
                if (!fullReply.includes('## Fuentes') && !fullReply.includes('Fuentes:')) {
                    const sourcesList = webResults.map(r => `- [${r.title}](${r.url})`).join('\n');
                    fullReply += `\n\n## Fuentes\n${sourcesList}`;
                }
            }

            await db('response_ia').where({ response_id: responseId }).update({ reply: fullReply });
            io.to(room).emit('assistant:end', { chatId: numericChatId, responseId, reply: fullReply });
        } catch (err: any) {
            console.error('Error en generación:', err);
            const errorReply = err.message?.includes('timeout') ? '⏳ El oráculo está sobrecargado. Intenta de nuevo.' : '❌ Error generando respuesta.';
            fullReply = errorReply;
            await db('response_ia').where({ response_id: responseId }).update({ reply: fullReply });
            io.to(room).emit('assistant:end', { chatId: numericChatId, responseId, reply: fullReply });
        } finally {
            abortControllers.delete(responseId);
        }

        const messageCount = await db('message').where({ chat_id: parseInt(chat_id) }).count('* as count').first();
        const chatInfo = await db('chat').where({ chat_id: parseInt(chat_id) }).first();
        if (messageCount && (messageCount.count as number) === 1 && message && message.trim() !== 'Vacío' && chatInfo?.Name === 'Nuevo conjuro…') {
            const newTitle = await generateChatTitle(message);
            await db('chat').where({ chat_id: parseInt(chat_id) }).update({ Name: newTitle });
            io.to(room).emit('chat:title-updated', { chatId: numericChatId, title: newTitle });
        }

        if (webSearchPerformed) io.to(room).emit('search:end', { chatId: numericChatId });

    } catch (error) {
        console.error('Error en upload:', error);
        if (!res.headersSent) res.status(500).json({ error: 'Error interno' });
    }
});

router.post('/abort', authMiddleware, async (req: AuthRequest, res) => {
    const { responseId } = req.body;
    if (!responseId) return res.status(400).json({ error: 'responseId requerido' });
    const controller = abortControllers.get(parseInt(responseId));
    if (controller) {
        controller.abort();
        abortControllers.delete(parseInt(responseId));
        return res.json({ success: true });
    }
    return res.json({ success: false });
});

export default router;