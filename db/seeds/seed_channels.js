/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("channels").del();

  // Inserts seed entries
  await knex("channels").insert([
    {
      id: "cha_123456",
      name: "Soccer-2024-Pl",
      description: "A channel for premier league fixtures for 2024.",
      category: "Soocer",
      is_active: true,
    },
    {
      id: "cha_234567",
      name: "Soccer-2024-UEFA",
      description: "A channel for UEFA fixtures for 2024.",
      category: "Soccer",
      is_active: true,
    },
  ]);
}
