import Joi from "joi";
import { subscibeChannel, subscribeToAll } from "./controller.js";

const register = async (server, options) => {
  server.route({
    // POST method to subscribe to all sports channels
    method: "POST",
    path: "/subscribe",
    options: {
      auth: "simple",
      handler: async (request, h) => {
        return await subscribeToAll(request, h);
      },
    },
  });

  server.route({
    // POST method to subscribe to a specific channel
    method: "POST",
    path: "/subscribe/{id}",
    options: {
      auth: "simple",
      handler: async (request, h) => {
        return await subscibeChannel(request, h);
      },
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
    },
  });

  server.route({
    // POST method to unsubscribe from a specific channel
    method: "POST",
    path: "/unsubscribe/{id}",
    options: {
      auth: "simple",
      handler: async (request, h) => {
        return await unsubscribeChannel(request, h);
      },
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
    },
  });
};

const name = "subscribe-plugin";
export const plugin = { register, name };
export { name };
