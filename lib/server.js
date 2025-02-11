import Hapi from "@hapi/hapi";
import { plugin as usersPlugin } from "./plugins/services/auth/index.js";

const server = Hapi.server({
  //3002 is the port number where the server will run since 3000 may already be in use
  port: 3002,
  host: "localhost",
  router: {
    stripTrailingSlash: true,
  },
});

const registerRoutes = async (server) => {
  await server.register({
    plugin: usersPlugin,
  });
  console.log("Routes registration function executed");
};

const configureServer = async () => {
  await registerRoutes(server);
  console.log("Routes registered");
  return server;
};

export { configureServer };
