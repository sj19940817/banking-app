import { columns } from "@/components/transactions/columns";
import { DataTable } from "@/components/transactions/data-table";
import getTransactions from "@/server/data";
import Form from "./form";

export default async function Banking({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const data = await getTransactions();

  return (
    <div>
      <DataTable columns={columns} data={data} />

      <div className="flex">
        <Form type={slug} />
      </div>
    </div>
  );
}
