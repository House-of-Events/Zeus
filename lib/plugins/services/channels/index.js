import Joi from "joi";
import { getChannels } from "./controller.js";

const register = async (server, options) => {
  // Route to get all channels - no authentication required
  server.route({
    method: "GET",
    path: "/channels",
    options: {
      auth: false, // No authentication required
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
