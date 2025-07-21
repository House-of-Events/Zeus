// Jest setup file for global test configuration
import dotenv from "dotenv";

// Load environment variables for tests
dotenv.config({ path: ".env.test" });

// Set test environment
process.env.NODE_ENV = "test";

// Disable database connections in tests
process.env.DISABLE_DB = "true";

// Global test setup
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
};
