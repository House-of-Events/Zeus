/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("sports_channels").del();

  // Inserts seed entries
  await knex("sports_channels").insert([
    {
      id: "cha_123456",
      name: "Soccer-2024-Pl",
      description: "A channel for premier league fixtures for 2024.",
      sport_type: "Soccer",
      is_active: true,
    },
    {
      id: "cha_234567",
      name: "Soccer-2024-UEFA",
      description: "A channel for UEFA fixtures for 2024.",
      sport_type: "Soccer",
      is_active: true,
    },
    {
      id: "cha_345678",
      name: "Basketball-2024-NBA",
      description: "A channel for NBA fixtures for 2024.",
      sport_type: "Basketball",
      is_active: true,
    },
  ]);
}
