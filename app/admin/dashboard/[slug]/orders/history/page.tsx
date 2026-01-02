import { getOrdersHistory } from "@/app/actions/orders";
import { OrdersTable } from "@/components/orders/orders-table";

export default async function OrdersHistoryPage() {
  const { orders, error } = await getOrdersHistory();

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Order History</h1>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
