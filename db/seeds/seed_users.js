const bcrypt = require("bcryptjs");
const { generateUserId } = require("../../utils/_idGenerator");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      id: generateUserId(),
      name: "John Doe",
      email: "john.doe@example.com",
      password: await bcrypt.hash("password123", 12),
    },
    {
      id: generateUserId(),
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: await bcrypt.hash("password123", 12),
    },
    {
      id: generateUserId(),
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      password: await bcrypt.hash("password123", 12),
    },
    {
      id: generateUserId(),
      name: "Mitch John",
      email: "mitch.johnson@example.com",
      password: await bcrypt.hash("password123", 12),
    },
  ]);
};
