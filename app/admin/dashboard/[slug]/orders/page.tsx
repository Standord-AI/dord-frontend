import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { OrdersTable } from "@/components/orders/orders-table";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return <div className="p-4">Unauthorized: No token found</div>;
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.tenant_id) {
    return <div className="p-4">Unauthorized: Invalid token</div>;
  }

  const paymentServiceUrl =
    process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

  try {
    const res = await fetch(`${paymentServiceUrl}/api/v1/orders`, {
      headers: {
        "Tenant-ID": payload.tenant_id,
        Cookie: `Authorization=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch orders:", res.status, res.statusText);
      return <div className="p-4">Error fetching orders: {res.statusText}</div>;
    }

    const data = await res.json();

    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        </div>
        <OrdersTable orders={data.orders || []} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return (
      <div className="p-4">Error loading orders. Please try again later.</div>
    );
  }
}
