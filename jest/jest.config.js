export default {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapping: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.(js|ts)$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/*.(js|ts)", "**/?(*.)+(spec|test).(js|ts)"],
  collectCoverageFrom: [
    "lib/**/*.js",
    "!lib/**/*.test.js",
    "!lib/**/*.spec.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
