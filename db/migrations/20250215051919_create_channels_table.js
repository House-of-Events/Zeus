/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("channels", function (table) {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("description");
    table.string("category").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
    //Indexes
    table.index("category");
    table.index("is_active");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable("channels");
}
