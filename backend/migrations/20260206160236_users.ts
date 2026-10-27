import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", (t) => {
    t.increments("user_id").primary();
    t.string("name").notNullable();
    t.string("email").notNullable().unique();
    t.string("password").notNullable();
    t.integer("plan_id").unsigned().notNullable();
    t.foreign("plan_id").references("plan_id").inTable("plan").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
