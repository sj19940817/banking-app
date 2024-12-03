"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Transaction = {
  id: number;
  amount: number;
  balance: number;
  date: Date;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
];
