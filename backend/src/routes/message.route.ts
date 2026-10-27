import express from 'express';
import Message from '../../models/message.model';
import ResponseIA from '../../models/response_ia.model';
import db from '../db';

const router = express.Router();

/** Elimina turnos (respuesta + mensaje usuario) posteriores al índice editado. Los archivos ligados a mensajes borrados se eliminan. */
async function pruneSubsequentTurns(
    orderedMessages: Pick<Message, 'message_id'>[],
    orderedResponses: Pick<ResponseIA, 'response_id'>[],
    messageIndex: number
) {
    const prunedUserMessageIds = orderedMessages.slice(messageIndex + 1).map((r) => r.message_id);
    const prunedResponseIds = orderedResponses.slice(messageIndex + 1).map((r) => r.response_id);
    if (prunedResponseIds.length) {
        await ResponseIA.query().delete().whereIn('response_id', prunedResponseIds);
    }
    if (prunedUserMessageIds.length) {
        await Message.query().delete().whereIn('message_id', prunedUserMessageIds);
    }
    return { prunedUserMessageIds, prunedResponseIds };
}

router.patch('/', async (req, res) => {
    const { message_id, content } = req.body;
    try {
        const message = await Message.query().findById(message_id) as Message;
        if (!message) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        await message.$query().patch({
            content: content
        });

        const orderedMessages = await Message.query()
            .where('chat_id', message.chat_id)
            .orderBy('message_id', 'asc')
            .select('message_id');
        const messageIndex = orderedMessages.findIndex(
            (row) => (row as Message).message_id === Number(message_id)
        );

        if (messageIndex < 0) {
            return res.status(200).json({ ok: true, regenerated: false, prunedUserMessageIds: [], prunedResponseIds: [] });
        }

        const orderedResponses = await ResponseIA.query()
            .where('chat_id', message.chat_id)
            .orderBy('response_id', 'asc')
            .select('response_id');

        const { prunedUserMessageIds, prunedResponseIds } = await pruneSubsequentTurns(
            orderedMessages as Pick<Message, 'message_id'>[],
            orderedResponses as Pick<ResponseIA, 'response_id'>[],
            messageIndex
        );

        const targetResponse = orderedResponses[messageIndex] as ResponseIA | undefined;

        if (!targetResponse) {
            return res.status(200).json({
                ok: true,
                regenerated: false,
                prunedUserMessageIds,
                prunedResponseIds,
            });
        }

        return res.status(200).json({
            ok: true,
            regenerated: true,
            responseId: targetResponse.response_id,
            prunedUserMessageIds,
            prunedResponseIds,
        });

    } catch (error) {                          
        return res.status(500).json({ error: 'Error interno del servidor' });
    }                                          
}); 
// GET versions
router.get('/:messageId/versions', async (req, res) => {
    const messageId = parseInt(req.params.messageId);
    if (isNaN(messageId)) return res.status(400).json({ error: 'ID inválido' });
    try {
        const versions = await db('message_version')
            .where('message_id', messageId)
            .orderBy('version_number', 'asc')
            .select('version_id', 'content', 'response_content', 'version_number', 'created_at');
        res.json({ versions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener versiones' });
    }
});

// EDIT message - CORRECTED: removed premature assistant:start
router.patch('/edit', async (req, res) => {
    const { message_id, new_content, chat_id } = req.body;
    if (!message_id || !new_content || !chat_id) {
        return res.status(400).json({ error: 'Faltan parámetros' });
    }

    try {
        const originalMessage = await Message.query().findById(message_id);
        if (!originalMessage) return res.status(404).json({ error: 'Mensaje no encontrado' });

        const orderedMessages = await Message.query()
            .where('chat_id', chat_id)
            .orderBy('message_id', 'asc')
            .select('message_id');
        const messageIndex = orderedMessages.findIndex(m => m.message_id === Number(message_id));
        const orderedResponses = await ResponseIA.query()
            .where('chat_id', chat_id)
            .orderBy('response_id', 'asc');
        const currentResponse = orderedResponses[messageIndex];

        // Guardar snapshot
        if (originalMessage.content !== new_content) {
            const existingVersions = await db('message_version')
                .where('message_id', message_id)
                .orderBy('version_number', 'desc')
                .first();
            const nextVersion = (existingVersions?.version_number || 0) + 1;
            await db('message_version').insert({
                message_id,
                content: originalMessage.content,
                response_content: currentResponse?.reply || '',
                version_number: nextVersion,
            });
        }

        // Eliminar mensajes posteriores y sus respuestas
        const messagesToDelete = await Message.query()
            .where('chat_id', chat_id)
            .where('message_id', '>', message_id)
            .select('message_id');
        const messageIdsToDelete = messagesToDelete.map(m => m.message_id);
        if (messageIdsToDelete.length > 0) {
            const responsesToDelete = await ResponseIA.query()
                .where('chat_id', chat_id)
                .orderBy('response_id', 'asc')
                .limit(messageIdsToDelete.length);
            for (const resp of responsesToDelete) await ResponseIA.query().deleteById(resp.response_id);
            await Message.query().delete().whereIn('message_id', messageIdsToDelete);
        }

        // Actualizar mensaje original
        await Message.query().patchAndFetchById(message_id, { content: new_content });

        // Eliminar respuesta anterior si existe
        if (currentResponse) await ResponseIA.query().deleteById(currentResponse.response_id);

        // Crear nueva respuesta vacía
        const [newResponseId] = await db('response_ia').insert({
            reply: '',
            date: new Date(),
            chat_id: parseInt(chat_id)
        });
        const targetResponse = await ResponseIA.query().findById(newResponseId);
        if (!targetResponse) throw new Error('No se pudo crear la respuesta IA');

        const io = req.app.get('io');
        const room = `chat-${chat_id}`;

        // Respuesta HTTP inmediata
        res.status(200).json({ ok: true, regenerated: true, responseId: targetResponse.response_id });


        // Emitir solo assistant:prepare (el assistant:start se emitirá con el primer token)
        io.to(room).emit('assistant:prepare', { chatId: chat_id, responseId: targetResponse.response_id });

        // Regenerar respuesta en segundo plano
        (async () => {
            const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            const prompt = `Eres un asistente experto. Responde directamente y sin usar placeholders como [insertar...] o [temperatura]. Usa números y datos reales.

## Contexto temporal
Fecha actual: ${today}.

## Pregunta del usuario
${new_content}

## Instrucciones
- Proporciona una respuesta relevante y actualizada
- Si se te pide un dato específico (temperatura, precio, etc.), proporciona un número exacto si es posible
- Si no tienes información actualizada, dilo claramente
- Utiliza **negritas** para enfatizar
- Utiliza formato Markdown para los enlaces, por ejemplo: [texto descriptivo](url)
- No utilices placeholders como "[insertar temperatura]"
- Si se te pide buscar información en internet, forzar la búsqueda web si es necesario`;

            let fullReply = '';
            const model = process.env.OLLAMA_MODEL || 'gemma2:2b';
            let firstTokenSent = false;

            try {
                const abortController = new AbortController();
                const timeoutId = setTimeout(() => abortController.abort(), 120000);

                const ollamaRes = await fetch('http://localhost:11434/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model, prompt, stream: true, options: { temperature: 0.7, num_predict: 500 } }),
                    signal: abortController.signal
                });
                clearTimeout(timeoutId);

                if (!ollamaRes.ok || !ollamaRes.body) throw new Error(`Ollama error ${ollamaRes.status}`);
                const reader = ollamaRes.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                while (true) {
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
                                fullReply += token;
                                if (!firstTokenSent) {
                                    firstTokenSent = true;
                                    io.to(room).emit('assistant:start', { chatId: chat_id, responseId: targetResponse.response_id });
                                }
                                io.to(room).emit('assistant:token', { chatId: chat_id, responseId: targetResponse.response_id, token });
                            }
                        } catch (e) { }
                    }
                }
                fullReply = fullReply.trim() || 'No pude regenerar una respuesta.';


                // Remove any remaining placeholders
                fullReply = fullReply.replace(/\[inserta[^\]]*\]/gi, '[dato no disponible]');
                fullReply = fullReply.replace(/\[temperatura\]/gi, '[dato no disponible]');
                fullReply = fullReply.replace(/\[precio\]/gi, '[dato no disponible]');

                await ResponseIA.query().patchAndFetchById(targetResponse.response_id, { reply: fullReply });
                io.to(room).emit('assistant:end', { chatId: chat_id, responseId: targetResponse.response_id, reply: fullReply });
            } catch (err: any) {
                console.error('Error regenerando:', err);
                const errorReply = err.name === 'AbortError' ? '⏳ Tiempo de espera agotado.' : '❌ Error al regenerar.';
                fullReply = errorReply;
                await ResponseIA.query().patchAndFetchById(targetResponse.response_id, { reply: errorReply });
                io.to(room).emit('assistant:end', { chatId: chat_id, responseId: targetResponse.response_id, reply: errorReply });
            }

            io.to(room).emit('message:edited', { chatId: chat_id, messageId: message_id, newContent: new_content });
            io.to(room).emit('assistant:response-created', { chatId: chat_id, responseId: targetResponse.response_id });
        })();

    } catch (error) {
        console.error('Error en edit message:', error);
        if (!res.headersSent) return res.status(500).json({ error: 'Error interno al editar mensaje' });
    }
});

// SWITCH VERSION (sin cambios)
router.patch('/version', async (req, res) => {
    const { message_id, version_number, chat_id } = req.body;
    if (!message_id || version_number === undefined || !chat_id) {
        return res.status(400).json({ error: 'Faltan parámetros: message_id, version_number, chat_id' });
    }

    try {
        const snapshot = await db('message_version').where({ message_id, version_number }).first();
        if (!snapshot) {
            return res.status(404).json({ error: `Versión ${version_number} no encontrada para el mensaje ${message_id}` });
        }

        // Eliminar mensajes posteriores
        const messagesToDelete = await Message.query()
            .where('chat_id', chat_id)
            .where('message_id', '>', message_id)
            .select('message_id');
        const deletedMessageIds = messagesToDelete.map(m => m.message_id);

        if (deletedMessageIds.length > 0) {
            const responsesToDelete = await ResponseIA.query()
                .where('chat_id', chat_id)
                .orderBy('response_id', 'asc')
                .limit(deletedMessageIds.length);
            for (const resp of responsesToDelete) {
                await ResponseIA.query().deleteById(resp.response_id);
            }
            await Message.query().delete().whereIn('message_id', deletedMessageIds);
        }

        // Restaurar contenido del usuario
        const updatedUserMessage = await Message.query().patchAndFetchById(message_id, { content: snapshot.content });
        if (!updatedUserMessage) {
            return res.status(404).json({ error: 'No se pudo actualizar el mensaje de usuario' });
        }

        // Gestionar respuesta IA
        const currentResponses = await ResponseIA.query()
            .where('chat_id', chat_id)
            .orderBy('response_id', 'asc');

        const currentMessages = await Message.query()
            .where('chat_id', chat_id)
            .orderBy('message_id', 'asc')
            .select('message_id');
        const messageIdx = currentMessages.findIndex(m => m.message_id === Number(message_id));

        let targetResponse: any = currentResponses[messageIdx];

        if (snapshot.response_content) {
            if (targetResponse) {
                await ResponseIA.query().patchAndFetchById(targetResponse.response_id, { reply: snapshot.response_content });
                targetResponse = await ResponseIA.query().findById(targetResponse.response_id);
            } else {
                const [newRespId] = await db('response_ia').insert({
                    reply: snapshot.response_content,
                    date: new Date(),
                    chat_id: parseInt(chat_id)
                });
                targetResponse = await ResponseIA.query().findById(newRespId);
                if (!targetResponse) throw new Error('No se pudo crear la respuesta restaurada');
            }
        } else {
            if (targetResponse) {
                await ResponseIA.query().deleteById(targetResponse.response_id);
                targetResponse = null;
            }
        }

        const io = req.app.get('io');
        io.to(`chat-${chat_id}`).emit('version:changed', {
            chatId: chat_id,
            restoredVersionNumber: version_number,
            updatedUserMessage: {
                message_id: updatedUserMessage.message_id,
                text: updatedUserMessage.content,
                date: updatedUserMessage.date
            },
            updatedResponse: targetResponse ? {
                response_id: targetResponse.response_id,
                text: targetResponse.reply
            } : null,
            deletedMessageIds
        });

        res.json({
            ok: true,
            restoredVersion: version_number,
            updatedUserMessage: {
                id: updatedUserMessage.message_id,
                text: updatedUserMessage.content
            },
            updatedResponse: targetResponse ? {
                id: targetResponse.response_id,
                text: targetResponse.reply
            } : null,
            deletedMessageIds
        });
    } catch (error) {
        console.error('Error en version switch:', error);
        res.status(500).json({ error: 'Error interno al cambiar de versión' });
    }
});

export default router;