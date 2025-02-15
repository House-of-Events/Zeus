import Joi from "joi";
import { getUser, getUsers, registerUser } from "./controller.js";

const register = async (server, options) => {
  // Route to get all users - requires authentication
  server.route({
    method: "GET",
    path: "/accounts",
    options: {
      auth: "simple",
      handler: async (request, h) => {
        return await getUsers(request, h);
      },
      description: "Get all user accounts",
      tags: ["api", "accounts"],
    },
  });

  // Route to register a new user - no authentication required
  server.route({
    method: "POST",
    path: "/accounts",
    options: {
      auth: false, // Explicitly disable auth for registration
      handler: async (request, h) => {
        return await registerUser(request, h);
      },
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
          first_name: Joi.string().required(),
          last_name: Joi.string().required(),
        }),
      },
      description: "Register a new user account",
      tags: ["api", "accounts"],
    },
  });

  // Route to get a single user - requires authentication
  server.route({
    method: "GET",
    path: "/account/{id}",
    options: {
      auth: "simple",
      handler: async (request, h) => {
        return await getUser(request, h);
      },
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
      description: "Get a specific user account by ID",
      tags: ["api", "accounts"],
    },
  });
};

const name = "users-plugin";

export const plugin = { register, name };
export { name };
