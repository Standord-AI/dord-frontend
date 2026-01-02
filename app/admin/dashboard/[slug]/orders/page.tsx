import { getActiveOrders } from "@/app/actions/orders";
import { OrdersTable } from "@/components/orders/orders-table";

export default async function OrdersPage() {
  const { orders, error } = await getActiveOrders();

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Active Orders</h1>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
