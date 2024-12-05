import { prismaMock } from "@/singleton";
import { doTransaction } from "../actions";

const sum = (a: number, b: number) => {
  return a + b;
};

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

describe("doTransaction", () => {
  const mockAccount = {
    id: 1,
    balance: 1000,
  };

  describe("deposit", () => {
    it("should return an error if deposit amount is negative or zero", async () => {
      const response = await doTransaction({ amount: -50, type: "deposit" });
      expect(response).toEqual({
        success: false,
        error: "Amount must be greater than zero.",
      });
    });

    it("should deposit the amount successfully", async () => {
      prismaMock.account.findUniqueOrThrow.mockResolvedValue(mockAccount);
      prismaMock.account.update.mockResolvedValue({
        ...mockAccount,
        balance: mockAccount.balance + 200,
      });

      const response = await doTransaction({ amount: 200, type: "deposit" });

      expect(prismaMock.account.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.account.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          balance: { increment: 200 },
          transactions: {
            create: {
              type: "DEPOSIT",
              amount: 200,
              balance: 1200, // original balance + deposit amount
              date: expect.any(Date),
            },
          },
        },
      });
      expect(response).toEqual({
        success: true,
        data: { balance: 1200 },
      });
    });

    it("should return an error if deposit fails", async () => {
      prismaMock.account.findUniqueOrThrow.mockResolvedValue(mockAccount);
      prismaMock.account.update.mockRejectedValue(new Error("Error"));

      const response = await doTransaction({ amount: 200, type: "deposit" });
      expect(response).toEqual({
        success: false,
        error: "Deposit Failed",
      });
    });
  });

  describe("withdraw", () => {
    it("should return an error if withdraw amount is less than or equal to zero", async () => {
      const response = await doTransaction({ amount: 0, type: "withdraw" });
      expect(response).toEqual({
        success: false,
        error: "Amount must be greater than zero.",
      });
    });

    it("should return an error if funds are insufficient", async () => {
      prismaMock.account.findUnique.mockResolvedValue(mockAccount);

      const response = await doTransaction({ amount: 2000, type: "withdraw" });

      expect(response).toEqual({
        success: false,
        error: "Insufficient funds.",
      });
    });

    it("should withdraw the amount successfully", async () => {
      prismaMock.account.findUnique.mockResolvedValue(mockAccount);
      prismaMock.account.update.mockResolvedValue({
        ...mockAccount,
        balance: mockAccount.balance - 200,
      });

      const response = await doTransaction({ amount: 200, type: "withdraw" });

      expect(prismaMock.account.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.account.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          balance: { decrement: 200 },
          transactions: {
            create: {
              type: "WITHDRAW",
              amount: 200,
              balance: 800, // original balance - withdraw amount
              date: expect.any(Date),
            },
          },
        },
      });
      expect(response).toEqual({
        success: true,
        data: { balance: 800 },
      });
    });

    it("should return an error if withdrawal fails", async () => {
      prismaMock.account.findUnique.mockResolvedValue(mockAccount);
      prismaMock.account.update.mockRejectedValue(new Error("Error"));

      const response = await doTransaction({ amount: 200, type: "withdraw" });

      expect(response).toEqual({
        success: false,
        error: "Withdraw Failed",
      });
    });
  });

  describe("invalid transaction type", () => {
    it("should return success for unhandled transaction types", async () => {
      const response = await doTransaction({
        amount: 100,
        type: "invalidType",
      });
      expect(response).toEqual({ success: false, error: "Invalid Type!" });
    });
  });
});
