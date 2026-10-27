import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("document_chunk", (t) => {
        t.increments("chunk_id").primary();
        t.string("doc_id").notNullable();
        t.text("content").notNullable();
        t.text("embedding", "longtext").notNullable();
        t.string("source_file").notNullable();
        t.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("document_chunk");
}
