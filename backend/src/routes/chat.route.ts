import express, { Request, Response } from "express";
import fs from 'fs';
import { authMiddleware, AuthRequest } from '../middleware/logger';
import DocumentChunk from "../../models/document_chunk.model";
import Chat from "../../models/chat.model";
import Message from "../../models/message.model";
import ResponseIA from "../../models/response_ia.model";
import FileModel from "../../models/file.model";

const router = express.Router();
router.use(authMiddleware);

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
}

function getFileContentAndStats(filePath: string): { content: string; size: number; lines: number; words: number } {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const size = fs.statSync(filePath).size;
        const lines = content.split('\n').length;
        const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
        return { content, size, lines, words };
    } catch {
        return { content: '', size: 0, lines: 0, words: 0 };
    }
}

// ─── GET /api/chat ────────────────────────────────────────────────────────────
router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const chats = await Chat.query()
            .where("user_id", req.userId!)
            .orderBy("chat_id", "desc");
        res.json({ chats });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("❌ Error en GET /api/chat:", msg);
        res.status(500).json({ error: "Error al obtener los chats" });
    }
});

// ─── GET /api/chat/:id (con conteo de mensajes) ───────────────────────────────
router.get('/:id', async (req: AuthRequest, res) => {
    try {
        const userId = Number(req.params.id);
        if (!Number.isInteger(userId) || userId !== req.userId) {
            return res.status(403).json({ error: "Acceso denegado" });
        }
        const chats = await Chat.query()
            .where("user_id", userId)
            .orderBy("chat_id", "desc")
            .select("chat.*");

        const chatsWithCount = await Promise.all(chats.map(async (chat) => {
            const messageCount = await Message.query()
                .where("chat_id", chat.chat_id)
                .resultSize();
            return {
                ...chat.toJSON(),
                message_count: messageCount,
            };
        }));

        res.json({ chats: chatsWithCount });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("❌ Error en GET /api/chat/:id:", msg);
        res.status(500).json({ error: "Error al obtener el chat" });
    }
});

// ─── POST /api/chat ───────────────────────────────────────────────────────────
router.post("/", async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
        res.status(400).json({ error: "El campo 'name' es requerido" });
        return;
    }
    try {
        const newChat = await Chat.query().insertAndFetch({
            Name: name.trim(),
            user_id: req.userId!,
        });
        res.status(201).json({ chat: newChat });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("❌ Error en POST /api/chat:", msg);
        res.status(500).json({ error: "Error al crear el chat", detail: msg });
    }
});

// ─── POST /api/chat/message (legacy, no se usa) ──────────────
router.post("/message", async (req: Request, res: Response) => {
    res.status(501).json({ error: "Endpoint deprecated, usa /api/upload" });
});

// ─── GET /api/chat/:id/messages ───────────────────────────────────────────────
router.get("/:id/messages", async (req: AuthRequest, res: Response) => {
    const chatId = parseInt(req.params.id);
    if (isNaN(chatId)) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }
    try {
        const chat = await Chat.query().findById(chatId);
        if (!chat) return res.status(404).json({ error: "Chat no encontrado" });
        if (chat.user_id !== req.userId) return res.status(403).json({ error: "Acceso denegado" });

        const userMessages = await Message.query()
            .where("chat_id", chatId)
            .orderBy("message_id", "asc")
            .select("message_id", "content");

        const messagesWithFiles = await Promise.all(userMessages.map(async (msg) => {
            const files = await FileModel.query()
                .where("message_id", msg.message_id)
                .select("file_id", "name", "path", "content");

            const attachments = files.map((file: any) => ({
                name: file.name,
                id: file.file_id,
                content: file.content || '',
                size: 0,
                lines: 0,
                words: 0,
            }));

            // Calcular estadísticas si no están guardadas
            for (const att of attachments) {
                if (!att.content && att.id) {
                    // Buscar el archivo en files para obtener la ruta
                    const fileRecord = files.find(f => f.file_id === att.id);
                    if (fileRecord && fs.existsSync(fileRecord.path)) {
                        const stats = getFileContentAndStats(fileRecord.path);
                        att.content = stats.content;
                        att.size = stats.size;
                        att.lines = stats.lines;
                        att.words = stats.words;
                    }
                } else if (att.content) {
                    const lines = att.content.split('\n').length;
                    const words = att.content.trim() === '' ? 0 : att.content.trim().split(/\s+/).length;
                    att.lines = lines;
                    att.words = words;
                    att.size = Buffer.byteLength(att.content, 'utf-8');
                }
            }

            return {
                id: `u-${msg.message_id}`,
                text: msg.content,
                sender: "user" as const,
                attachments: attachments.map(a => a.name),
                attachmentIds: attachments.map(a => a.id),
                attachmentsMeta: attachments.map(a => ({ size: a.size, lines: a.lines, words: a.words })),
                attachmentContents: attachments.map(a => a.content),
            };
        }));

        const iaResponses = await ResponseIA.query()
            .where("chat_id", chatId)
            .orderBy("response_id", "asc")
            .select("response_id", "reply");

        const assistantMessages = iaResponses.map(ia => ({
            id: `a-${ia.response_id}`,
            text: ia.reply,
            sender: "assistant" as const,
        }));

        const merged: any[] = [];
        const maxLen = Math.max(messagesWithFiles.length, assistantMessages.length);
        for (let i = 0; i < maxLen; i++) {
            if (messagesWithFiles[i]) merged.push(messagesWithFiles[i]);
            if (assistantMessages[i]) merged.push(assistantMessages[i]);
        }

        res.json({ messages: merged });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("❌ Error en GET /api/chat/:id/messages:", msg);
        res.status(500).json({ error: "Error al cargar los mensajes" });
    }
});

// ─── PATCH /api/chat/:id ──────────────────────────────────────────────────────
router.patch("/:id", async (req: AuthRequest, res: Response) => {
    const chatId = parseInt(req.params.id);
    const { name } = req.body;
    if (isNaN(chatId)) { res.status(400).json({ error: "ID inválido" }); return; }
    if (!name || typeof name !== "string" || !name.trim()) {
        res.status(400).json({ error: "El campo 'name' es requerido" });
        return;
    }
    try {
        const chat = await Chat.query().findById(chatId);
        if (!chat) { res.status(404).json({ error: "Chat no encontrado" }); return; }
        if (chat.user_id !== req.userId) { res.status(403).json({ error: "Acceso denegado" }); return; }
        const updated = await Chat.query().patchAndFetchById(chatId, { Name: name.trim() });
        if (!updated) { res.status(404).json({ error: "Chat no encontrado" }); return; }
        res.json({ chat: updated });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("❌ Error en PATCH /api/chat/:id:", msg);
        res.status(500).json({ error: "Error al actualizar el chat" });
    }
});

// ─── DELETE /api/chat/:id ─────────────────────────────────────────────────────
router.delete("/:id", async (req: AuthRequest, res: Response) => {
    const chatId = parseInt(req.params.id);
    if (isNaN(chatId)) { res.status(400).json({ error: "ID inválido" }); return; }
    try {
        const chat = await Chat.query().findById(chatId);
        if (!chat) { res.status(404).json({ error: "Chat no encontrado" }); return; }
        if (chat.user_id !== req.userId) { res.status(403).json({ error: "Acceso denegado" }); return; }
        const deleted = await Chat.query().deleteById(chatId);
        if (!deleted) { res.status(404).json({ error: "Chat no encontrado" }); return; }
        res.json({ ok: true });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("❌ Error en DELETE /api/chat/:id:", msg);
        res.status(500).json({ error: "Error al borrar el chat" });
    }
});

export default router;
