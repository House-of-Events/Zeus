const hapi = require("@hapi/hapi");

const server = new hapi.Server({
  port: 9000,
  router: {
    stripTrailingSlash: true,
  },
});

const registerRoutes = async (server) => {
  await server.register([
    {
      plugin: require("./plugins/features/health"), //health check
      options: {},
    },
    {
      plugin: require("./plugins/services/auth"), //authentication
      options: {},
    },
  ]);
};

module.exports.configureServer = async () => {
  await registerRoutes(server);
  console.log("Routes registered");
  return server;
};
