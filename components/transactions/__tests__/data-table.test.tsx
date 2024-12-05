import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import "@testing-library/jest-dom";
import { Transaction } from "../columns";

const mockData: Transaction[] = [
  { id: 1, amount: 25, balance: 50, date: new Date(2024, 5, 2) },
  { id: 2, amount: 30, balance: 520, date: new Date(2024, 1, 2) },
  { id: 3, amount: 55, balance: 530, date: new Date(2024, 6, 23) },
  { id: 4, amount: 62, balance: 5230, date: new Date(2024, 2, 12) },
  { id: 5, amount: 293, balance: 500, date: new Date(2024, 8, 2) },
  { id: 6, amount: 123, balance: 5000, date: new Date(2024, 8, 2) },
  { id: 7, amount: 1234, balance: 50000, date: new Date(2024, 8, 2) },
];

const columns: ColumnDef<Transaction>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "balance", header: "Balance" },
  { accessorKey: "date", header: "Date" },
];

describe("DataTable Component", () => {
  it("renders the table with data", () => {
    render(<DataTable columns={columns} data={mockData} />);

    // Check that table headers are rendered
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();

    // Check that first page rows are rendered
    expect(screen.getByText("62")).toBeInTheDocument();
    expect(screen.getByText("5230")).toBeInTheDocument();
  });

  it("renders 'No results.' when data is empty", () => {
    render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("handles pagination correctly", () => {
    render(<DataTable columns={columns} data={mockData} />);

    // Check initial data (page 1)
    expect(screen.getByText(25)).toBeInTheDocument();
    expect(screen.getByText(30)).toBeInTheDocument();
    expect(screen.getByText(55)).toBeInTheDocument();
    expect(screen.getByText(62)).toBeInTheDocument();
    expect(screen.getByText(293)).toBeInTheDocument();

    // Click 'Next' button
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    // Check data on the second page
    expect(screen.queryByText(25)).not.toBeInTheDocument();
    expect(screen.queryByText(30)).not.toBeInTheDocument();
    expect(screen.getByText(123)).toBeInTheDocument();
    expect(screen.getByText(1234)).toBeInTheDocument();
  });

  it("disables 'Previous' button on the first page", () => {
    render(<DataTable columns={columns} data={mockData} />);

    const previousButton = screen.getByRole("button", { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it("disables 'Next' button on the last page", () => {
    render(<DataTable columns={columns} data={mockData} />);

    // Navigate to the last page
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    const previousButton = screen.getByRole("button", { name: /previous/i });
    expect(previousButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(nextButton).toBeDisabled();
  });
});
