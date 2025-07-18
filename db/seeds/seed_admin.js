/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Check if admin user already exists
  const existingAdmin = await knex("accounts")
    .where("email", "admin@zeus.com")
    .first();

  if (!existingAdmin) {
    // Insert admin user
    await knex("accounts").insert([
      {
        id: "acc_admin_001",
        first_name: "Admin",
        last_name: "User",
        email: "admin@zeus.com",
        password: "hashed_admin_password",
        created_at: new Date(),
        updated_at: new Date(),
        api_key: "admin",
        is_admin: true,
        slack_id: "slack_id_1",
      },
    ]);
    console.log("Admin user created successfully");
  } else {
    console.log("Admin user already exists");
  }
}
