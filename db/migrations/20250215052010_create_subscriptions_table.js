/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex){
    await knex.schema.createTable("subscriptions", function (table) {
        table.string("id").primary();
        table.string("user_id").notNullable().references("id").inTable("accounts");
        table.string("channel_id").notNullable().references("id").inTable("channels");
        table.string("channel_name").notNullable();
        table.dateTime("subscribed_at").defaultTo(knex.fn.now());
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);

        //contraints
        table.unique(["user_id", "channel_id"]);

        //Indexes
        table.index("user_id");
        table.index("channel_id");
        table.index("is_active");
    });

};
export async function down(knex){
    await knex.schema.dropTable("subscriptions");  
};

