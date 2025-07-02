/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("accounts").del();

  // Insert users data
  await knex("accounts").insert([
    {
      id: "acc_3f7d02d1f1",
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@example.com",
      password: "hashed_password_1",
      created_at: new Date(),
      updated_at: new Date(),
      api_key: "api_key_1",
    },
    {
      id: "acc_9b8c212e47",
      first_name: "Bob",
      last_name: "Johnson",
      email: "bob@example.com",
      password: "hashed_password_2",
      created_at: new Date(),
      updated_at: new Date(),
      api_key: "api_key_2",
    },
  ]);
}
