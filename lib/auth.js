import Basic from "@hapi/basic";
import { db } from "../db/index.js";

export const configureAuth = async (server) => {
  await server.register(Basic);
  server.auth.strategy("simple", "basic", {
    validate: async (request, username, password, h) => {
      try {
        // Use the username field as your API key
        const apiKey = username;

        const account = await db("accounts")
          .select("*")
          .where("api_key", apiKey)
          .first();

        if (!account) {
          return { isValid: false, credentials: null };
        }

        // If user is admin, bypass authentication
        if (account.is_admin === true) {
          console.log("Admin account detected");
          return {
            isValid: true,
            credentials: { ...account, isAdmin: true },
          };
        }

        return {
          isValid: true,
          credentials: account,
        };
      } catch (error) {
        console.error("Error validating account:", error);
        return { isValid: false, credentials: null };
      }
    },
    // This is critical to prevent browser prompts
    unauthorizedAttributes: {
      // This prevents the WWW-Authenticate header from being sent
      wwwAuthenticate: false,
    },
  });
};
