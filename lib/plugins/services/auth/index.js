const Joi = require("joi");
const controller = require("./controller");
const cookieAuth = require("hapi-auth-cookie");

exports.plugin = {
  name: "auth-plugin",
  version: "1.0.0",
  register: async (server) => {
    await server.register(require("@hapi/cookie"));

    server.auth.strategy("session", "cookie", {
      cookie: {
        name: "sid-example",
        password: "password-should-be-32-characters",
        isSecure: false, // For development only
      },
      redirectTo: "/login",
      validate: async (request, session) => {
        console.log(session)
        if (!session.id) {
          return { isValid: false };
        }
        return { isValid: true, credentials: { id: session.id } };
      },
    });

    server.auth.default("session");

    // Define login route
    server.route({
      method: "POST",
      path: "/v1/login",
      config: {
        auth: false, // No authentication required for login
        handler: controller.loginHandler,
      },
    });

    // Define profile route
    server.route({
      method: "GET",
      path: "/v1/profile",
      config: {
        handler: controller.profileHandler,
      },
    });
  },
};
