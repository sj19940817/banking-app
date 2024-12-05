"use server";

import prisma from "@/prisma.config";

type BankingResponse = {
  success: boolean;
  data?: object;
  error?: string;
};

const deposit = async (amount: number): Promise<BankingResponse> => {
  if (amount <= 0) {
    return {
      success: false,
      error: "Amount must be greater than zero.",
    };
  }

  const account = await prisma.account.findUniqueOrThrow({
    where: { id: 1 },
  });

  try {
    const updatedAccount = await prisma.account.update({
      where: { id: 1 },
      data: {
        balance: { increment: amount },
        transactions: {
          create: {
            type: "DEPOSIT",
            amount,
            balance: account.balance + amount,
            date: new Date(),
          },
        },
      },
    });

    return { success: true, data: { balance: updatedAccount.balance } };
  } catch {
    return { success: false, error: "Deposit Failed" };
  }
};

const withdraw = async (amount: number): Promise<BankingResponse> => {
  if (amount <= 0) {
    return {
      success: false,
      error: "Amount must be greater than zero.",
    };
  }

  try {
    const account = await prisma.account.findUnique({ where: { id: 1 } });

    if (!account || account.balance < amount) {
      return {
        success: false,
        error: "Insufficient funds.",
      };
    }

    const updatedAccount = await prisma.account.update({
      where: { id: 1 },
      data: {
        balance: { decrement: amount },
        transactions: {
          create: {
            type: "WITHDRAW",
            amount,
            balance: account.balance - amount,
            date: new Date(),
          },
        },
      },
    });

    return { success: true, data: { balance: updatedAccount.balance } };
  } catch {
    return { success: false, error: "Withdraw Failed" };
  }
};

export async function doTransaction({
  amount,
  type,
}: {
  amount: number;
  type: string;
}): Promise<BankingResponse> {
  if (type === "deposit") return deposit(amount);
  else if (type === "withdraw") return withdraw(amount);
  else return { success: false, error: "Invalid Type!" };
}
