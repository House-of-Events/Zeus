/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("subscriptions").del();

  // Inserts seed entries
  await knex("subscriptions").insert([
    {
      id: "sub_123456",
      user_id: "acc_3f7d02d1f1",
      channel_id: "cha_123456",
      channel_name: "Soccer-2024-Pl",
      subscribed_at: knex.fn.now(),
      is_active: true,
    },
    {
      id: "sub_234567",
      user_id: "acc_3f7d02d1f1",
      channel_id: "cha_234567",
      channel_name: "Soccer-2024-UEFA",
      subscribed_at: knex.fn.now(),
      is_active: true,
    },
    {
      id: "sub_345678",
      user_id: "acc_9b8c212e47",
      channel_id: "cha_123456",
      channel_name: "Soccer-2024-Pl",
      subscribed_at: knex.fn.now(),
      is_active: true,
    },
  ]);
}
