import express from "express";
import db from "../db";

const router = express.Router();

// ── Límites base por plan ─────────────────────────────────────────────────────
// Se usan para calcular cuántos mensajes/archivos ha consumido el usuario hoy.
// Los valores deben coincidir con los definidos en VALID_PLANS del payment.route.
const PLAN_DEFAULTS: Record<string, { messages: number; files: number }> = {
    Goblin: { messages: 10, files: 1 },
    Wizard: { messages: 30, files: 5 },
    Elder_dragon: { messages: 9999999, files: 9999999 },
};

// ── GET /api/stats/:user_id ───────────────────────────────────────────────────
// Devuelve estadísticas completas del usuario: mensajes, archivos, chats y actividad reciente.
router.get("/:user_id", async (req, res) => {
    const userId = Number(req.params.user_id);
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "user_id inválido" });
    }

    try {
        // ── Plan del usuario ──────────────────────────────────────────────────
        // Join entre plan y user para obtener los límites actuales del usuario
        const plan = await db("plan")
            .join("user", "plan.plan_id", "user.plan_id")
            .where("user.user_id", userId)
            .select("plan.plan_id", "plan.name", "plan.message_limit", "plan.file_limit", "plan.price")
            .first();

        // Calcular cuánto ha consumido el usuario hoy contando directamente en la BD
        const planName = plan?.name ?? "Goblin";
        const defaults = PLAN_DEFAULTS[planName] ?? PLAN_DEFAULTS["Goblin"];

        const [{ msg_used_today }] = await db("message")
            .where({ user_id: userId })
            .whereRaw("DATE(date) = CURDATE()")
            .count("message_id as msg_used_today");

        const [{ files_used_today }] = await db("file")
            .join("message", "file.message_id", "message.message_id")
            .where("file.user_id", userId)
            .whereRaw("DATE(message.date) = CURDATE()")
            .count("file.file_id as files_used_today");

        const msgUsed = Number(msg_used_today ?? 0);
        const filesUsed = Number(files_used_today ?? 0);

        // ── Estadísticas de mensajes ──────────────────────────────────────────
        const [{ total_messages }] = await db("message").where({ user_id: userId }).count("message_id as total_messages");
        // messages_today y files_today reutilizan los conteos ya hechos arriba (evita queries duplicadas)
        const messages_today = msgUsed;
        const [{ messages_week }] = await db("message").where({ user_id: userId }).whereRaw("date >= DATE_SUB(NOW(), INTERVAL 7 DAY)").count("message_id as messages_week");
        const [{ messages_month }] = await db("message").where({ user_id: userId }).whereRaw("MONTH(date) = MONTH(NOW()) AND YEAR(date) = YEAR(NOW())").count("message_id as messages_month");

        // ── Estadísticas de archivos ──────────────────────────────────────────
        const [{ total_files }] = await db("file").where({ user_id: userId }).count("file_id as total_files");
        const files_today = filesUsed;

        // Agrupar archivos por extensión para mostrar un desglose por tipo
        const filesRaw: { name: string }[] = await db("file").where({ user_id: userId }).select("name");
        const filesByType: Record<string, number> = {};
        filesRaw.forEach(({ name }) => {
            const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "sin ext";
            filesByType[ext] = (filesByType[ext] ?? 0) + 1;
        });

        // ── Estadísticas de chats ─────────────────────────────────────────────
        const [{ total_chats }] = await db("chat").where({ user_id: userId }).count("chat_id as total_chats");

        // Días distintos en los que el usuario envió al menos un mensaje
        const [activeDaysRows] = await db.raw(
            "SELECT COUNT(DISTINCT DATE(date)) as active_days FROM message WHERE user_id = ?",
            [userId]
        );
        const active_days = Number(activeDaysRows[0]?.active_days ?? 0);

        // Últimos 5 chats con la fecha del mensaje más reciente en cada uno
        const recentChats = await db("chat")
            .leftJoin("message", "chat.chat_id", "message.chat_id")
            .where("chat.user_id", userId)
            .select("chat.chat_id", "chat.Name as chat_name", db.raw("MAX(message.date) as last_message_date"))
            .groupBy("chat.chat_id", "chat.Name")
            .orderBy("last_message_date", "desc")
            .limit(5);

        // Últimos 5 archivos subidos, con la fecha del mensaje al que pertenecen
        const recentFiles = await db("file")
            .join("message", "file.message_id", "message.message_id")
            .where("file.user_id", userId)
            .select("file.file_id", "file.name as file_name", "message.date as upload_date")
            .orderBy("message.date", "desc")
            .limit(5);

        // ── Respuesta final ───────────────────────────────────────────────────
        return res.json({
            messages: {
                total: Number(total_messages),
                today: Number(messages_today),
                week: Number(messages_week),
                month: Number(messages_month),
                used_today: msgUsed,
                limit_today: defaults.messages,
            },
            files: {
                total: Number(total_files),
                today: Number(files_today),
                by_type: filesByType,
                used_today: filesUsed,
                limit_today: defaults.files,
            },
            chats: {
                total: Number(total_chats),
            },
            activity: {
                active_days,
                recent_chats: recentChats,
                recent_files: recentFiles,
            },
            plan: plan ?? null,
        });

    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        return res.status(500).json({ error: "Error al obtener estadísticas" });
    }
});

export default router;