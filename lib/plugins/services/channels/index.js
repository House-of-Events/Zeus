import Joi from "joi";
import { getChannels } from "./controller.js";

const register = async (server, options) => {
  // Route to get all users - requires authentication
  server.route({
    method: "GET",
    path: "/channels",
    options: {
      handler: async (request, h) => {
        return await getChannels(request, h);
      },
      description: "Get all channels for users",
      tags: ["api", "channels"],
    },
  });
};

const name = "channels-plugin";

export const plugin = { register, name };
export { name };
