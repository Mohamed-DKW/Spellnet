import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("chat", (t) => {
        t.increments("chat_id").primary();
        t.string("Name").notNullable();
        t.integer("user_id").unsigned().notNullable();
        t.foreign("user_id").references("user_id").inTable("user").onDelete("CASCADE");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("chat");
}

