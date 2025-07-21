import { health } from "../../../../../lib/plugins/features/health/controller.js";

describe("Health Controller", () => {
  it("should return a 200 status code", async () => {
    const result = await health();
    expect(result).toEqual({ status: "Healthy", uptime: expect.any(Number) });
  });

  it("should return the correct structure", async () => {
    const result = await health();
    expect(result).toEqual(
      expect.objectContaining({
        status: expect.any(String),
        uptime: expect.any(Number),
      }),
    );
  });
});
