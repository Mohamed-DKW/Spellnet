import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("file", (t) => {
        t.text("content", "longtext");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("file", (t) => {
        t.dropColumn("content");
    });
}
