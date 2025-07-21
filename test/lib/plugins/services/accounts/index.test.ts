import { plugin as accountsPlugin } from "../../../../../lib/plugins/services/accounts/index.js";
import Hapi from "@hapi/hapi";

// Default mock: user does not exist (for POST), user exists (for GET)
jest.mock("../../../../../db", () => {
  return {
    db: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]), // default: user does not exist
      insert: jest.fn(() => ({
        returning: jest.fn().mockResolvedValue([
          {
            id: 2,
            email: "new@example.com",
            first_name: "New",
            last_name: "User",
            password: "password456",
            api_key: "api_key_456",
          },
        ]),
      })),
    })),
  };
});

describe("Accounts Plugin", () => {
  let server;
  let db;
  beforeEach(async () => {
    server = Hapi.server({
      port: 0,
      host: "localhost",
    });

    server.auth.scheme("custom", () => ({
      authenticate: async (request, h) => {
        return h.authenticated({ credentials: { id: 1, user: "test" } });
      },
    }));

    server.auth.strategy("simple", "custom");

    await server.register(accountsPlugin);
    db = require("../../../../../db");
  });

  afterEach(() => {
    server.stop();
    jest.clearAllMocks();
  });

  it("should register the GET /accounts route", async () => {
    // Simulate user exists for GET
    db.db.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([
        {
          id: 1,
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          password: "password123",
          api_key: "api_key_123",
        },
      ]),
      insert: jest.fn(() => ({
        returning: jest.fn().mockResolvedValue([
          {
            id: 2,
            email: "new@example.com",
            first_name: "New",
            last_name: "User",
            password: "password456",
            api_key: "api_key_456",
          },
        ]),
      })),
    }));
    const result = await server.inject({
      method: "GET",
      url: "/accounts",
    });
    expect(result.statusCode).toBe(200);
  });

  it("should create a user on POST /accounts with valid payload", async () => {
    // Simulate user does not exist for POST
    db.db.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]), // user does not exist
      insert: jest.fn(() => ({
        returning: jest.fn().mockResolvedValue([
          {
            id: 2,
            email: "new@example.com",
            first_name: "New",
            last_name: "User",
            password: "password456",
            api_key: "api_key_456",
          },
        ]),
      })),
    }));
    const result = await server.inject({
      method: "POST",
      url: "/accounts",
      payload: {
        email: "new@example.com",
        password: "password456",
        first_name: "New",
        last_name: "User",
      },
    });
    expect(result.statusCode).toBe(201);
    expect(result.result).toHaveProperty("data");
  });

  it("should return 400 for invalid payload on POST /accounts", async () => {
    const result = await server.inject({
      method: "POST",
      url: "/accounts",
      payload: { email: "not-an-email" }, // missing required fields
    });
    expect(result.statusCode).toBe(400);
  });

  it("should return 404 if user not found on GET /account/{id}", async () => {
    // Simulate user not found for GET
    db.db.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]), // user not found
      insert: jest.fn(() => ({
        returning: jest.fn().mockResolvedValue([
          {
            id: 2,
            email: "new@example.com",
            first_name: "New",
            last_name: "User",
            password: "password456",
            api_key: "api_key_456",
          },
        ]),
      })),
    }));
    const result = await server.inject({
      method: "GET",
      url: "/account/nonexistentid",
    });
    expect(result.statusCode).toBe(404);
  });

  it("should return a 200 status code for GET /account/{id} with valid user id", async () => {
    db.db.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([
        {
          id: "1",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          password: "password123",
          api_key: "api_key_123",
        },
      ]),
      insert: jest.fn(() => ({
        returning: jest.fn().mockResolvedValue([
          {
            id: "1",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
            password: "password123",
            api_key: "api_key_123",
          },
        ]),
      })),
    }));
    const result = await server.inject({
      method: "GET",
      url: "/account/1",
    });
    expect(result.statusCode).toBe(200);
  });
});
