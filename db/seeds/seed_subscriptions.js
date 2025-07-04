/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Insert seed entries
  await knex("subscriptions").insert([
    {
      id: "sub_123456",
      user_id: "acc_3f7d02d1f1",
      channel_id: "cha_123456",
      sport_type: "Soccer",
      subscribed_at: knex.fn.now(),
      is_active: true,
    },
    {
      id: "sub_234567",
      user_id: "acc_3f7d02d1f1",
      channel_id: "cha_345678",
      sport_type: "Basketball",
      subscribed_at: knex.fn.now(),
      is_active: true,
    },
    {
      id: "sub_345678",
      user_id: "acc_9b8c212e47",
      channel_id: "cha_123456",
      sport_type: "Soccer",
      subscribed_at: knex.fn.now(),
      is_active: true,
    },
  ]);
}
