import { Model } from "objection";
import User from "./user.model";
import Plan from "./plan.model";

// ── Modelo Payment ────────────────────────────────────────────────────────────
// Representa un registro de pago en la tabla "payment".
// Objection.js mapea automáticamente las propiedades al esquema de la BD.
export default class Payment extends Model {

    // Nombre de la tabla en la base de datos
    static get tableName() {
        return "payment";
    }

    // Columna que actúa como clave primaria
    static get idColumn() {
        return "payment_id";
    }

    // ── Propiedades tipadas ───────────────────────────────────────────────────
    payment_id!: number;
    user_id!: number;
    plan_id!: number;
    amount!: number;
    currency!: string;
    billing_name!: string;
    billing_email!: string;
    card_type!: "visa" | "mastercard" | "amex" | "discover";
    card_last4!: string;
    card_holder!: string;
    card_expiry!: string;
    status!: "pending" | "completed" | "failed" | "refunded";
    paid_at!: Date;

    // ── Validación JSON Schema ────────────────────────────────────────────────
    // Objection valida los datos contra este esquema antes de insertar o actualizar.
    static get jsonSchema() {
        return {
            type: "object",
            required: [
                "user_id", "plan_id", "amount", "billing_name",
                "billing_email", "card_type", "card_last4", "card_holder", "card_expiry",
            ],
            properties: {
                user_id: { type: "integer" },
                plan_id: { type: "integer" },
                amount: { type: "number" },
                currency: { type: "string", maxLength: 3 },
                billing_name: { type: "string" },
                billing_email: { type: "string" },
                card_type: { type: "string", enum: ["visa", "mastercard", "amex", "discover"] },
                card_last4: { type: "string", minLength: 4, maxLength: 4 },
                card_holder: { type: "string" },
                card_expiry: { type: "string", maxLength: 5 },
                status: { type: "string", enum: ["pending", "completed", "failed", "refunded"] },
            },
        };
    }

    // ── Relaciones con otros modelos ──────────────────────────────────────────
    // Permiten hacer `.withGraphFetched("user")` o `.withGraphFetched("plan")`
    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: "payment.user_id",
                to: "user.user_id",
            },
        },
        plan: {
            relation: Model.BelongsToOneRelation,
            modelClass: Plan,
            join: {
                from: "payment.plan_id",
                to: "plan.plan_id",
            },
        },
    };
}