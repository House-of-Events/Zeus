"use strict";
const controller = require("./controller.js");

exports.register = (server) => {
  server.route({
    method: "GET",
    path: "/v1/health",
    config: {
      auth: false,
      handler: async (request, reply) => {
        const res = await controller.health();
        return reply.response(res);
      },
    },
  });
};
exports.name = "health";
