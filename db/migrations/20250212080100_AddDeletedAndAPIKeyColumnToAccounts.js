/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  //add columns deleted and api_key to accounts table
  await knex.schema.table("accounts", function (table) {
    table.boolean("deleted").defaultTo(false);
    table.string("api_key");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  //drop columns deleted and api_key from accounts table
  await knex.schema.table("accounts", function (table) {
    table.dropColumn("deleted");
    table.dropColumn("api_key");
  });
}
