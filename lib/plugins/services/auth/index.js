import Joi from "joi";

const register = async (server, options) => {
  server.route({
    method: "GET",
    path: "/soccer-2024-pl",
    handler: (request, h) => {
      return "Welcome to the Soccer 2024 PL";
    }
  });
};

// Defining the plugin name
const name = "users-plugin";

// Export both as named exports
export const plugin = { register, name };
export { name };
