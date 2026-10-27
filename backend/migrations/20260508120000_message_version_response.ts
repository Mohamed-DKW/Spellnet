import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("message_version", (t) => {
        t.text("response_content", "longtext");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("message_version", (t) => {
        t.dropColumn("response_content");
    });
}