import knexConfig from "../../../../knexfile.js";
import knex from "knex";

import dotenv from "dotenv";
import { generateAPIKey } from "../../../../utils/generateAPIKey.js";
import { generateUniqueId } from "../../../../utils/_idGenerator.js";
import { checkIfAccountExists } from "./helper.js";
dotenv.config();

const environment = process.env.NODE_ENV || "development";
console.log("Environment:", environment);
const config = knexConfig[environment];
const database = knex(config);
const accountsModel = database("accounts");

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

    // Validate required fields
    if (!email || !first_name || !last_name || !password) {
      return h
        .response({
          status: "error",
          message: "Missing required fields",
          details: {
            missing: Object.entries({ email, first_name, last_name, password })
              .filter(([_, value]) => !value)
              .map(([key]) => key),
          },
          code: "MISSING_FIELDS_FOR_CREATING_ACCOUNT",
        })
        .code(400);
    }

    // Check if account exists
    try {
      const accountExists = await checkIfAccountExists(email, accountsModel);
      if (accountExists) {
        return h
          .response({
            status: "error",
            message: "Account already exists",
            code: "ACCOUNT_EXISTS",
          })
          .code(409);
      }
    } catch (checkError) {
      console.error("Error checking account existence:", checkError);
      return h
        .response({
          status: "error",
          message: "Error verifying account status",
          code: "DATABASE_ERROR",
        })
        .code(500);
    }

    // Generate API key and ID
    let apiKey, userId;
    try {
      apiKey = await generateAPIKey();
      userId = await generateUniqueId("acc_");
    } catch (genError) {
      console.error("Error generating credentials:", genError);
      return h
        .response({
          status: "error",
          message: "Failed to generate account credentials",
          code: "CREDENTIAL_GEN_ERROR",
        })
        .code(500);
    }

    // Create the user
    try {
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

      return h
        .response({
          status: "success",
          message: "User registered successfully",
          data: user[0],
        })
        .code(201);
    } catch (dbError) {
      console.error("Database error during user creation:", dbError);
      return h
        .response({
          status: "error",
          message: "Failed to create user account",
          code: "DATABASE_ERROR",
        })
        .code(500);
    }
  } catch (error) {
    console.error("Unhandled error in registerUser:", error);
    return h
      .response({
        status: "error",
        message: "An unexpected error occurred",
        code: "SERVER_ERROR",
      })
      .code(500);
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
