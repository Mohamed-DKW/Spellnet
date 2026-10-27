import express from "express";
import Payment from "../../models/payment.model";
import Plan from "../../models/plan.model";
import User from "../../models/user.model";

const router = express.Router();

// ── Configuración de planes disponibles ──────────────────────────────────────
// Define los límites y precios de cada plan.
// Se usa como fuente de verdad para no depender solo del cliente.
const VALID_PLANS: Record<string, { message_limit: number; file_limit: number; price: number }> = {
    Goblin: { message_limit: 10, file_limit: 1, price: 0 },
    Wizard: { message_limit: 30, file_limit: 5, price: 20 },
    Elder_dragon: { message_limit: 9999999, file_limit: 9999999, price: 50 },
};

// ── POST /api/payment/checkout ────────────────────────────────────────────────
// Registra el pago y actualiza el plan del usuario en la misma operación.
// No guarda datos sensibles de tarjeta; solo tipo, últimos 4 dígitos y titular.
router.post("/checkout", async (req, res) => {
    const {
        user_id,
        plan_name,
        billing_name,
        billing_email,
        card_type,
        card_last4,
        card_holder,
        card_expiry,
        currency = "USD",
    } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!user_id || !plan_name || !billing_name || !billing_email ||
        !card_type || !card_last4 || !card_holder || !card_expiry) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Los últimos 4 dígitos deben ser exactamente 4 números
    if (card_last4.length !== 4 || !/^\d{4}$/.test(card_last4)) {
        return res.status(400).json({ error: "card_last4 debe ser exactamente 4 dígitos" });
    }

    const planConfig = VALID_PLANS[plan_name];
    if (!planConfig) {
        return res.status(400).json({ error: "Plan inválido" });
    }

    try {
        // Verificar que el usuario existe antes de procesar nada
        const user = await User.query().findById(user_id);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        // Obtener el plan actual del usuario para actualizarlo
        const plan = await Plan.query().findById(user.plan_id) as Plan;
        if (!plan) return res.status(404).json({ error: "Plan no encontrado" });

        // Actualizar los límites y precio del plan del usuario al nuevo plan
        await plan.$query().patch({
            name: plan_name,
            message_limit: planConfig.message_limit,
            file_limit: planConfig.file_limit,
            price: planConfig.price,
        });

        // Insertar el registro de pago con los datos no sensibles de tarjeta
        const payment = await Payment.query().insert({
            user_id: Number(user_id),
            plan_id: plan.plan_id,
            amount: planConfig.price,
            currency,
            billing_name,
            billing_email,
            card_type,
            card_last4,
            card_holder,
            card_expiry,
            status: "completed",
        });

        return res.status(201).json({
            message: "Pago registrado y plan actualizado correctamente",
            payment_id: payment.payment_id,
            plan: plan_name,
            amount: planConfig.price,
        });

    } catch (error) {
        console.error("Error en checkout:", error);
        return res.status(500).json({ error: "Error al procesar el pago" });
    }
});

// ── GET /api/payment/history/:user_id ────────────────────────────────────────
// Devuelve el historial de pagos de un usuario, ordenado del más reciente al más antiguo.
router.get("/history/:user_id", async (req, res) => {
    const userId = Number(req.params.user_id);
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "user_id inválido" });
    }

    try {
        const payments = await Payment.query()
            .where({ user_id: userId })
            .withGraphFetched("plan")
            .orderBy("paid_at", "desc");

        return res.json({ payments });
    } catch (error) {
        console.error("Error al obtener historial:", error);
        return res.status(500).json({ error: "Error al obtener historial de pagos" });
    }
});

// ── GET /api/payment/:payment_id ──────────────────────────────────────────────
// Devuelve un pago concreto con sus relaciones (útil para generar recibos).
router.get("/:payment_id", async (req, res) => {
    const paymentId = Number(req.params.payment_id);
    if (!paymentId || isNaN(paymentId)) {
        return res.status(400).json({ error: "payment_id inválido" });
    }

    try {
        const payment = await Payment.query()
            .findById(paymentId)
            .withGraphFetched("[user, plan]");

        if (!payment) return res.status(404).json({ error: "Pago no encontrado" });

        return res.json({ payment });
    } catch (error) {
        console.error("Error al obtener pago:", error);
        return res.status(500).json({ error: "Error al obtener el pago" });
    }
});

export default router;