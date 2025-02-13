import knexConfig from "../../../../knexfile.js";
import knex from "knex";

import dotenv from "dotenv";
import { generateAPIKey } from "../../../../utils/generateAPIKey.js";
import { generateUniqueId } from "../../../../utils/_idGenerator.js";
dotenv.config();

const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];
const database = knex(config);

const accountModel = database("accounts");

export const getUsers = async (request, h) => {
  try {
    console.log("Getting users");
    const users = await accountModel.select();
    return h.response(users).code(200);
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const registerUser = async (request, h) => {
  console.log("Registering user");
  try {
    const { email, first_name, last_name, password } = request.payload;
    const apiKey = await generateAPIKey();
    const userId = await generateUniqueId("acc_");
    const user = await accountModel.insert({
      id: userId,
      email,
      first_name,
      last_name,
      password,
      api_key: apiKey,
    });

    return h.response("User created successfully").code(201);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (request, h) => {
  try {
    const { id } = request.params;
    // Select all columns except password and return the first matching result
    const user = await accountModel
      .select("id", "email", "first_name", "last_name", "api_key")
      .where({ id });

    if (!user || user.length === 0) {
      return h.response({ message: "Account does not exist" }).code(404); // Return 404 if no user is found
    }

    return h.response(user).code(200);
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};
