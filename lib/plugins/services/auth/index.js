import Joi from "joi";
import { getUser, getUsers, registerUser } from "./controller.js";

const register = async (server, options) => {
  server.route({
    method: "GET",
    path: "/accounts",
    handler: async (request, h) => {
      return await getUsers(request, h);
    },
  });

  server.route({
    method: "POST",
    path: "/accounts",
    handler: async (request, h) => {
      return await registerUser(request, h);
    },
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
          first_name: Joi.string().required(),
          last_name: Joi.string().required(),
        }),
      },
    },
  });

  //get a single user based on ID
  server.route({
    method: "GET",
    path: "/account/{id}",
    handler: async (request, h) => {
      return await getUser(request, h);
    },
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
    },
  });
};

// Defining the plugin name
const name = "users-plugin";

// Export both as named exports
export const plugin = { register, name };
export { name };
