import Hapi from "@hapi/hapi";
import { plugin as usersPlugin } from "./plugins/services/accounts/index.js";
import { plugin as subscribePlugin } from "./plugins/services/subscribe/index.js";
import { plugin as channelsPlugin } from "./plugins/services/channels/index.js";
import { plugin as healthPlugin } from "./plugins/features/health/index.js";
import { configureAuth } from "./auth.js";

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: "0.0.0.0",
  routes: {
    cors: {
      origin: [
        "http://localhost:2000", // Local development
        "http://localhost:3000", // Alternative local port
        "https://hades-sable.vercel.app", // Your specific Vercel frontend
        "https://houseofevents.vercel.app",
      ],
      credentials: true, // Add this line to support credentials
      headers: ["Accept", "Authorization", "Content-Type"], // Common headers
      additionalHeaders: ["X-Requested-With"], // Optional additional headers
    },
  },
  router: {
    stripTrailingSlash: true,
  },
});

const registerRoutes = async (server) => {
  await server.register([
    {
      plugin: healthPlugin,
      routes: {
        prefix: "/v1",
      },
    },
    {
      plugin: usersPlugin,
      routes: {
        prefix: "/v1",
      },
    },
    {
      plugin: subscribePlugin,
      routes: {
        prefix: "/v1",
      },
    },
    {
      plugin: channelsPlugin,
      routes: {
        prefix: "/v1",
      },
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
