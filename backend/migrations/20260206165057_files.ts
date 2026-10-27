import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("file", (t) => {
        t.increments("file_id").primary();
        t.string("name").notNullable();
        t.string("path").notNullable();
        t.integer("user_id").unsigned().notNullable();
        t.foreign("user_id").references("user_id").inTable("user").onDelete("CASCADE");
        t.integer("message_id").unsigned().notNullable();
        t.foreign("message_id").references("message_id").inTable("message").onDelete("CASCADE");
        t.integer("plan_id").unsigned().notNullable();
        t.foreign("plan_id").references("plan_id").inTable("plan").onDelete("CASCADE");
    });
    // pruebas
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("file");
}

