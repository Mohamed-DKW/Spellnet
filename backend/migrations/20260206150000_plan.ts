import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("plan", (t) => {
        t.increments("plan_id").primary();
        t.enu("name", ["Goblin", "Wizard", "Elder_dragon"]).notNullable().defaultTo("Goblin");
        t.integer("message_limit").notNullable();
        t.integer("file_limit").notNullable();
        t.double("price").notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("plan");
}

