import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("contact_form", (t) => {
        t.increments("form_id").primary();
        t.string("name").notNullable();
        t.string("email").notNullable();
        t.string("message").notNullable();
        t.timestamp("date").defaultTo(knex.fn.now()).notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("contact_form");
}

