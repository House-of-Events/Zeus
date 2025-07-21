import { plugin as channelsPlugin } from "../../../../../lib/plugins/services/channels/index.js";
import Hapi from "@hapi/hapi";
import mockChannels from "../../../../mocks/plugins/services/channels/mockChannels.js";
// Mock the database module
jest.mock("../../../../../db/index.js", () => ({
  db: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockResolvedValue(mockChannels),
  })),
}));

describe("Channels Plugin", () => {
  let server;
  beforeEach(async () => {
    server = Hapi.server({
      port: 0,
      host: "localhost",
    });
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("Plugin Registration", () => {
    it("should register the channels plugin succesfully", async () => {
      await expect(server.register(channelsPlugin)).resolves.not.toThrow();
    });

    it("should have the correct plugin name", () => {
      expect(channelsPlugin.name).toBe("channels-plugin");
    });
  });

  describe("Channel Routes", () => {
    beforeEach(async () => {
      await server.register(channelsPlugin);
    });

    it("should return a list of channels with a 200 status code", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/channels",
      });

      expect(response.statusCode).toBe(200);
      expect(response.result).toBeDefined();
      expect(response.result).toHaveProperty("status");
      expect(response.result.status).toBe("success");
      expect(response.result).toHaveProperty("data");
      expect(Array.isArray(response.result.data)).toBe(true);
    });
  });
});
