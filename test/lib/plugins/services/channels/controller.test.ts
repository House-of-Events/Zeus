import { getChannels } from "../../../../../lib/plugins/services/channels/controller";
import { db } from "../../../../../db";
import mockChannels from "../../../../mocks/plugins/services/channels/mockChannels";

const mockSelect = jest.fn().mockReturnThis();
const mockOrderBy = jest.fn().mockResolvedValue(mockChannels);

// Mock db as a function that returns chainable methods
jest.mock("../../../../../db", () => {
  const mockDbFn = jest.fn(() => ({
    select: mockSelect,
    orderBy: mockOrderBy,
  }));
  return { db: mockDbFn };
});

describe("Channels Controller", () => {
  let mockRequest: any;
  let mockH: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {};

    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
  });

  it("should return all channels from getChannels", async () => {
    const result = await getChannels(mockRequest, mockH);

    expect(db).toHaveBeenCalledWith("sports_channels"); // db called as function
    expect(mockSelect).toHaveBeenCalledWith(
      "name",
      "id",
      "description",
      "is_active",
      "created_at",
    );
    expect(mockOrderBy).toHaveBeenCalledWith("created_at", "desc");

    expect(mockH.response).toHaveBeenCalledWith({
      status: "success",
      data: mockChannels,
    });
    expect(mockH.code).toHaveBeenCalledWith(200);
  });

  it("should handle select() errors gracefully", async () => {
    const mockError = new Error("Select query failed");

    // Reset the mocks and make select throw an error
    mockSelect.mockImplementation(() => {
      throw mockError;
    });
    mockOrderBy.mockResolvedValue([]);

    const result = await getChannels(mockRequest, mockH);

    expect(db).toHaveBeenCalledWith("sports_channels");
    expect(mockSelect).toHaveBeenCalledWith(
      "name",
      "id",
      "description",
      "is_active",
      "created_at",
    );
    // orderBy should not be called if select fails
    expect(mockOrderBy).not.toHaveBeenCalled();

    expect(mockH.response).toHaveBeenCalledWith({
      status: "error",
      message: "Database operation failed",
      code: "DATABASE_ERROR",
    });
    expect(mockH.code).toHaveBeenCalledWith(500);
  });

  it("should handle orderBy() errors gracefully", async () => {
    const mockError = new Error("OrderBy query failed");

    // Reset the mocks
    mockSelect.mockReturnThis();
    mockOrderBy.mockRejectedValue(mockError);

    const result = await getChannels(mockRequest, mockH);

    expect(db).toHaveBeenCalledWith("sports_channels");
    expect(mockSelect).toHaveBeenCalledWith(
      "name",
      "id",
      "description",
      "is_active",
      "created_at",
    );
    expect(mockOrderBy).toHaveBeenCalledWith("created_at", "desc");

    expect(mockH.response).toHaveBeenCalledWith({
      status: "error",
      message: "Database operation failed",
      code: "DATABASE_ERROR",
    });
    expect(mockH.code).toHaveBeenCalledWith(500);
  });
});
