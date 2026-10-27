import type { Knex } from "knex";

// ── Migración: tabla "payment" ────────────────────────────────────────────────
// Almacena cada transacción realizada por un usuario.
// Solo se guardan los últimos 4 dígitos y el tipo de tarjeta — nunca datos sensibles.
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("payment", (t) => {
        t.increments("payment_id").primary();

        // Relación con el usuario que paga y el plan que compra
        t.integer("user_id").unsigned().notNullable();
        t.foreign("user_id").references("user_id").inTable("user").onDelete("CASCADE");

        t.integer("plan_id").unsigned().notNullable();
        t.foreign("plan_id").references("plan_id").inTable("plan").onDelete("CASCADE");

        // Importe y divisa del cobro
        t.decimal("amount", 10, 2).notNullable();
        t.string("currency", 3).notNullable().defaultTo("USD");

        // Datos de facturación (nombre e email del comprador)
        t.string("billing_name").notNullable();
        t.string("billing_email").notNullable();

        // Datos no sensibles de la tarjeta usada
        t.enu("card_type", ["visa", "mastercard", "amex", "discover"]).notNullable();
        t.string("card_last4", 4).notNullable();   // Últimos 4 dígitos
        t.string("card_holder").notNullable();
        t.string("card_expiry", 5).notNullable();  // Formato MM/AA

        // Estado del pago y fecha de realización
        t.enu("status", ["pending", "completed", "failed", "refunded"])
            .notNullable()
            .defaultTo("pending");
        t.timestamp("paid_at").defaultTo(knex.fn.now()).notNullable();
    });
}

// ── Rollback: elimina la tabla si existe ──────────────────────────────────────
export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("payment");
}