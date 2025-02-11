/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Clear existing data to avoid duplicates
  await knex("accounts").del();

  // Insert users data
  await knex("accounts").insert([
    {
      id: "user_123456",
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "hashed_password_1",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: "user_234567",
      name: "Bob Smith",
      email: "bob@example.com",
      password: "hashed_password_2",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

}
