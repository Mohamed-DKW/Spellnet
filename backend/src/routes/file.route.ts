import express from 'express';
import db from '../db';
import fs from 'fs';
import { authMiddleware, AuthRequest } from '../middleware/logger';

const router = express.Router();

function computeStats(content: string) {
    const lines = content.split('\n').length;
    const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    const chars = content.length;
    return { lines, words, chars };
}

router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const fileId = parseInt(req.params.id);
        const file = await db('file')
            .where({ file_id: fileId, user_id: req.userId })
            .first();
        if (!file) return res.status(404).json({ error: 'Archivo no encontrado' });

        let content = file.content;
        let stats = { lines: 0, words: 0, chars: 0 };

        if (!content) {
            if (fs.existsSync(file.path)) {
                content = fs.readFileSync(file.path, 'utf-8');
            } else {
                content = '[El contenido no está disponible]';
            }
        }
        stats = computeStats(content);

        let size = 0;
        if (fs.existsSync(file.path)) {
            size = fs.statSync(file.path).size;
        } else {
            size = Buffer.byteLength(content, 'utf-8');
        }

        res.json({
            id: file.file_id,
            name: file.name,
            content,
            size,
            lines: stats.lines,
            words: stats.words,
            chars: stats.chars,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el archivo' });
    }
});

export default router;