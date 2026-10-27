import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("message_version", (t) => {
        t.increments("version_id").primary();
        t.integer("message_id").unsigned().notNullable();
        t.foreign("message_id").references("message_id").inTable("message").onDelete("CASCADE");
        t.text("content").notNullable();
        t.integer("version_number").notNullable();
        t.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
        t.index(["message_id", "version_number"]);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("message_version");
}