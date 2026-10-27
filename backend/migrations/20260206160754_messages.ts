import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("message", (t) => {
        t.increments("message_id").primary();
        t.string("content").notNullable();
        t.timestamp("date").defaultTo(knex.fn.now()).notNullable();
        t.integer("chat_id").unsigned().notNullable();
        t.foreign("chat_id").references("chat_id").inTable("chat").onDelete("CASCADE");
        t.integer("user_id").unsigned().notNullable();
        t.foreign("user_id").references("user_id").inTable("user").onDelete("CASCADE");
        t.integer("plan_id").unsigned().notNullable();
        t.foreign("plan_id").references("plan_id").inTable("plan").onDelete("CASCADE");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("message");
}

