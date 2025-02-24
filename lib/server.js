import Hapi from "@hapi/hapi";
import { plugin as usersPlugin } from "./plugins/services/accounts/index.js";
import { plugin as subscribePlugin } from "../lib/plugins/services/subscribe/index.js";
import { configureAuth } from "./auth.js";

const server = Hapi.server({
  //3000 since within the container we are exposing port 3000 to local machine port 3002
  //so when we access localhost:3002 on our local machine, it will be redirected to localhost:3000 within the container
  port: process.env.PORT || 3000,
  host: "0.0.0.0",
  routes: {
    cors: {
      origin: ["*"],
    },
  },
  router: {
    stripTrailingSlash: true,
  },
});

const registerRoutes = async (server) => {
  await server.register([
    {
      plugin: usersPlugin,
    },
    {
      plugin: subscribePlugin,
    },
  ]);
  console.log("Routes registration function executed");
};

const configureServer = async () => {
  //auth configuration
  await configureAuth(server);
  await registerRoutes(server);
  console.log("Routes registered");
  return server;
};

export { configureServer };
