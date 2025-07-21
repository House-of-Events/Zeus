import { db } from "../../../../../db";
import { checkIfAccountExists } from "../../../../../lib/plugins/services/accounts/helper";

// Create a mock database model that supports chaining
const createMockDbModel = (shouldExist) => ({
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockImplementation(({ email }) => {
    if (shouldExist) {
      return Promise.resolve([
        {
          id: 1,
          email: email,
        },
      ]);
    } else {
      return Promise.resolve([]);
    }
  }),
});

describe("checkIfAccountExists", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("should return true if account exists", async () => {
    const mockDb = createMockDbModel(true);
    const result = await checkIfAccountExists("test@example.com", mockDb);
    expect(result).toBe(true);
  });

  it("should return false if account does not exist", async () => {
    const mockDb = createMockDbModel(false);
    const result = await checkIfAccountExists("nonexistent@example.com", mockDb);
    expect(result).toBe(false);
  });

    it("should throw an error if database query fails", async ()=>{
      const mockDb = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockRejectedValue(new Error("Database query failed")),
      };
      
      await expect(checkIfAccountExists("test@example.com", mockDb))
        .rejects
        .toThrow("Database error while checking account: Database query failed");
    });
});
