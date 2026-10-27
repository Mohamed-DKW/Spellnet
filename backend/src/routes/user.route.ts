import express, { Response } from "express";
import User from "../../models/user.model";
import { authMiddleware, AuthRequest } from "../middleware/logger";

const router = express.Router();

// ── GET /api/user/ ────────────────────────────────────────────────────────────
// Devuelve la lista de todos los usuarios (sin datos sensibles de contraseña).
router.get("/", async (req, res) => {
    try {
        const users = await User.query().select("user_id", "name", "email", "plan_id");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

// ── GET /api/user/location ────────────────────────────────────────────────────
// Devuelve los datos del usuario autenticado junto con su plan actual.
// Requiere token JWT válido en la cabecera Authorization.
router.get("/location", authMiddleware, async (req: AuthRequest, res: Response) => {
    if (!req.userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const user = await User.query()
        .select("user_id", "name", "email", "plan_id")
        .findById(req.userId)
        .withGraphFetched("plan");

    res.json(user);
});

// ── PATCH /api/user/name ──────────────────────────────────────────────────────
// Actualiza el nombre del usuario autenticado.
// Requiere token JWT válido. El nuevo nombre no puede estar vacío.
router.patch("/name", authMiddleware, async (req: AuthRequest, res: Response) => {
    if (!req.userId) return res.status(401).json({ error: "Usuario no autenticado" });

    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }

    try {
        await User.query().patchAndFetchById(req.userId, { name: name.trim() });
        return res.json({ message: "Nombre actualizado correctamente", name: name.trim() });
    } catch (error) {
        console.error("Error al actualizar nombre:", error);
        return res.status(500).json({ error: "Error al actualizar el nombre" });
    }
});

export default router;