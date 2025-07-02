/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("accounts", function (table) {
    table.string("id").primary();
    table.string("first_name");
    table.string("last_name");
    table.string("email").unique();
    table.string("password");
    table.timestamps(true, true);
    table.boolean("deleted").defaultTo(false);
    table.string("api_key");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable("accounts");
}
