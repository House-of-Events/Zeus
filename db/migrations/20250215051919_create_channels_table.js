/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable("sports_channels", function (table) {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("description");
    table.string("sport_type").notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
    //Indexes
    table.index("sport_type");
    table.index("is_active");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable("sports_channels");
}
