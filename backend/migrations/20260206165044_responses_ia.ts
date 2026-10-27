import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("response_ia", (t) => {
        t.increments("response_id").primary();
        t.text("reply").notNullable();
        t.timestamp("date").defaultTo(knex.fn.now()).notNullable();
        t.integer("chat_id").unsigned().notNullable();
        t.foreign("chat_id").references("chat.chat_id").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("response_ia");
}

