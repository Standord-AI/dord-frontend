import { getAbandonedCarts } from "@/app/actions/carts";
import { AbandonedCartsTable } from "@/components/orders/abandoned-carts-table";

export default async function AbandonedCartsPage() {
  const { carts, error } = await getAbandonedCarts(1); // Default to 1 hour

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Abandoned Carts</h1>
      </div>
      <AbandonedCartsTable carts={carts} />
    </div>
  );
}
