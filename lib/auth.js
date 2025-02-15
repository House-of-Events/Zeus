// hapi basic auth
import knexConfig from "../knexfile.js";
import knex from "knex";
const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];
const database = knex(config);
const accountModel = database("accounts");
import Basic from "@hapi/basic";

export const configureAuth = async (server) => {
  await server.register(Basic);
  server.auth.strategy("simple", "basic", {
    validate: async (request, username, password, h) => {
      try {
        if (!password) {
          return { isValid: false, credentials: null };
        }

        const account = await database("accounts")
          .select("*")
          .where("api_key", password)
          .first();

        if (!account) {
          return { isValid: false, credentials: null };
        }

        console.log("Authentication successful for account:", account.id);
        return {
          isValid: true,
          credentials: account,
        };
      } catch (error) {
        console.error("Error validating account:", error);
        return { isValid: false, credentials: null };
      }
    },
  });
};
