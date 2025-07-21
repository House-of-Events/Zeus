import Hapi from "@hapi/hapi";
import { plugin as healthPlugin } from "../../../../../lib/plugins/features/health/index.js";

describe("Health Plugin", () => {
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
    it("should register the health plugin successfully", async () => {
      await expect(server.register(healthPlugin)).resolves.not.toThrow();
    });

    it("should have the correct plugin name", () => {
      expect(healthPlugin.name).toBe("health");
    });

    it("should have a register function", () => {
      expect(typeof healthPlugin.register).toBe("function");
    });
  });

  describe("Health Route", () => {
    beforeEach(async () => {
      await server.register(healthPlugin);
    });

    it("should return health status when called", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(200);
      expect(response.result).toBeDefined();
      expect(response.result).toHaveProperty("status");
      expect(response.result).toHaveProperty("uptime");
      expect(response.result.status).toBe("Healthy");
      expect(typeof response.result.uptime).toBe("number");
      expect(response.result).toEqual(
        expect.objectContaining({
          status: expect.any(String),
          uptime: expect.any(Number),
        }),
      );
    });

    it("should not require authentication", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.statusCode).toBe(200);
    });

    it("should return correct response structure", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/health",
      });

      expect(response.result).toEqual({
        status: "Healthy",
        uptime: expect.any(Number),
      });
    });

    it("should handle multiple requests correctly", async () => {
      const response1 = await server.inject({
        method: "GET",
        url: "/health",
      });

      const response2 = await server.inject({
        method: "GET",
        url: "/health",
      });

      expect(response1.statusCode).toBe(200);
      expect(response2.statusCode).toBe(200);
      expect(response1.result.status).toBe("Healthy");
      expect(response2.result.status).toBe("Healthy");
      expect(response1.result.uptime).toBeLessThanOrEqual(
        response2.result.uptime,
      );
    });
  });

  describe("Error Handling", () => {
    beforeEach(async () => {
      await server.register(healthPlugin);
    });

    it("should handle invalid HTTP methods", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/health",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should handle non-existent routes", async () => {
      const response = await server.inject({
        method: "GET",
        url: "/nonexistent",
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
