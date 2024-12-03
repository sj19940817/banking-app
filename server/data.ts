"use server";

import prisma from "@/prisma.config";
import { Transaction } from "@/components/transactions/columns";

export default async function getTransactions(): Promise<Transaction[]> {
  const transactions = await prisma.transaction.findMany();

  return transactions as Transaction[];
}
