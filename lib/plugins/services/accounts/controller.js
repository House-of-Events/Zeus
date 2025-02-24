import knexConfig from "../../../../knexfile.js";
import knex from "knex";

import dotenv from "dotenv";
import { generateAPIKey } from "../../../../utils/generateAPIKey.js";
import { generateUniqueId } from "../../../../utils/_idGenerator.js";
dotenv.config();

const environment = process.env.NODE_ENV || "development";
console.log("Environment:", environment);
const config = knexConfig[environment];
const database = knex(config);

export const getUsers = async (request, h) => {
  try {
    if (!request.auth.credentials || !request.auth.credentials.id) {
      return h.response({ message: "User not authenticated" }).code(401);
    }
    const users = await database("accounts").select();
    return h.response(users).code(200);
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const registerUser = async (request, h) => {
  try {
    const { email, first_name, last_name, password } = request.payload;
    const apiKey = await generateAPIKey();
    const userId = await generateUniqueId("acc_");
    const user = await database("accounts")
      .insert({
        id: userId,
        email,
        first_name,
        last_name,
        password,
        api_key: apiKey,
      })
      .returning("*");

    return h.response(user).code(201);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (request, h) => {
  try {
    if (!request.auth.credentials || !request.auth.credentials.id) {
      return h.response({ message: "User not authenticated" }).code(401);
    }
    const { id } = request.params;
    const user = await database("accounts")
      .select("id", "email", "first_name", "last_name", "api_key")
      .where({ id });

    if (!user || user.length === 0) {
      return h.response({ message: "Account does not exist" }).code(404);
    }

    return h.response(user).code(200);
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};
