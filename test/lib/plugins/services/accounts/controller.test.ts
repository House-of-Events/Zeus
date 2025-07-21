import {
  getUsers,
  registerUser,
} from "../../../../../lib/plugins/services/accounts/controller";
import mockAccounts from "../../../../mocks/plugins/services/accounts/mockAccounts";
import * as helper from "../../../../../lib/plugins/services/accounts/helper";
import * as generateAPIKeyModule from "../../../../../utils/generateAPIKey.js";
import * as generateUniqueId from "../../../../../utils/_idGenerator.js";

jest.mock("../../../../../db", () => {
  // Use require here to avoid hoisting issues
  const mockAccountsImport = require("../../../../mocks/plugins/services/accounts/mockAccounts");
  const mockAccounts = mockAccountsImport.default || mockAccountsImport;
  const mockSelect = jest.fn().mockResolvedValue(mockAccounts);
  const mockInsert = jest.fn(() => ({
    returning: jest.fn().mockResolvedValue([
      {
        id: "user_id_123",
        email: "existing@example.com",
        first_name: "Test",
        last_name: "User",
        password: "password123",
        api_key: "api_key_123",
      },
    ]),
  }));
  const mockDbFn = jest.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
  }));
  return { db: mockDbFn };
});

describe("Accounts Controller", () => {
  let mockRequest: any;
  let mockH: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      auth: {
        credentials: {
          id: 1,
        },
      },
    };

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  describe("getUsers", () => {
    it("returns 401 if user is not authenticated", async () => {
      // Remove credentials to simulate unauthenticated user
      mockRequest.auth.credentials = null;

      const result = await getUsers(mockRequest, mockH);

      expect(mockH.response).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
      expect(mockH.code).toHaveBeenCalledWith(401);
    });

    it("returns users when authenticated", async () => {
      const result = await getUsers(mockRequest, mockH);
      expect(mockH.response).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith(mockAccounts);
      expect(mockH.response.mock.calls[0][0]).toEqual(mockAccounts);
      expect(mockH.code).toHaveBeenCalledWith(200);
    });
  });

  describe("registerUser", () => {
    beforeEach(() => {
      mockRequest = {
        payload: {
          email: "existing@example.com",
          first_name: "Test",
          last_name: "User",
          password: "password123",
        },
      };
      jest.clearAllMocks();
    });

    it("returns 400 for missing fields", async () => {
      // Delete last_name from request payload so its missing
      delete mockRequest.payload.last_name;
      const result = await registerUser(mockRequest, mockH);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Missing required fields",
          code: "MISSING_FIELDS_FOR_CREATING_ACCOUNT",
          details: expect.objectContaining({
            missing: expect.arrayContaining(["last_name"]),
          }),
        }),
      );
      expect(mockH.code).toHaveBeenCalledWith(400);
    });

    it("returns 409 if account already exists", async () => {
      jest.spyOn(helper, "checkIfAccountExists").mockResolvedValue(true);
      const result = await registerUser(mockRequest, mockH);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Account already exists",
          code: "ACCOUNT_EXISTS",
        }),
      );
      expect(mockH.code).toHaveBeenCalledWith(409);
    });

    it("returns 500 if account status check fails", async () => {
      jest
        .spyOn(helper, "checkIfAccountExists")
        .mockRejectedValue(new Error("Check failed"));
      const result = await registerUser(mockRequest, mockH);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Error verifying account status",
          code: "DATABASE_ERROR",
        }),
      );
      expect(mockH.code).toHaveBeenCalledWith(500);
    });

    it("creates api key and user id succesfully", async () => {
      jest.spyOn(helper, "checkIfAccountExists").mockResolvedValue(false);
      jest
        .spyOn(generateAPIKeyModule, "generateAPIKey")
        .mockResolvedValue("api_key_123");
      jest
        .spyOn(generateUniqueId, "generateUniqueId")
        .mockReturnValue("user_id_123");
      const result = await registerUser(mockRequest, mockH);
      // Expect no error
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "User registered successfully", // match your controller!
          data: expect.objectContaining({
            api_key: "api_key_123",
            id: "user_id_123",
          }),
        }),
      );
      expect(mockH.code).toHaveBeenCalledWith(201);
    });

    it("returns 500 for user id generation error", async () => {
      jest.spyOn(helper, "checkIfAccountExists").mockResolvedValue(false);
      jest
        .spyOn(generateAPIKeyModule, "generateAPIKey")
        .mockResolvedValue("api_key_123");
      jest
        .spyOn(generateUniqueId, "generateUniqueId")
        .mockImplementation(() => {
          throw new Error("Error Creating User ID");
        });
      const result = await registerUser(mockRequest, mockH);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to generate account credentials",
          code: "CREDENTIAL_GEN_ERROR",
        }),
      );
      expect(mockH.code).toHaveBeenCalledWith(500);
    });

    it("creates and saves the user successfully", async () => {
      jest.spyOn(helper, "checkIfAccountExists").mockResolvedValue(false);
      jest
        .spyOn(generateAPIKeyModule, "generateAPIKey")
        .mockResolvedValue("api_key_123");
      jest
        .spyOn(generateUniqueId, "generateUniqueId")
        .mockReturnValue("user_id_123");
      const result = await registerUser(mockRequest, mockH);
      expect(mockH.response).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "User registered successfully",
          data: expect.objectContaining({
            api_key: "api_key_123",
            id: "user_id_123",
          }),
        }),
      );
      expect(mockH.code).toHaveBeenCalledWith(201);
    });
  });
});
