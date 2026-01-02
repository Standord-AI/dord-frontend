"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { Order } from "@/global-types";

const getPaymentServiceUrl = () =>
  process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

async function fetchOrders(
  endpoint: string
): Promise<{ orders: Order[]; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return { orders: [], error: "Unauthorized: No token found" };
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.tenant_id) {
    return { orders: [], error: "Unauthorized: Invalid token" };
  }

  const paymentServiceUrl = getPaymentServiceUrl();

  try {
    const res = await fetch(`${paymentServiceUrl}${endpoint}`, {
      headers: {
        "Tenant-ID": payload.tenant_id,
        Cookie: `Authorization=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch orders from ${endpoint}:`,
        res.status,
        res.statusText
      );
      return { orders: [], error: `Error fetching orders: ${res.statusText}` };
    }

    const data = await res.json();
    return { orders: data.orders || [] };
  } catch (error) {
    console.error(`Error fetching orders from ${endpoint}:`, error);
    return {
      orders: [],
      error: "Error loading orders. Please try again later.",
    };
  }
}

export async function getActiveOrders() {
  return fetchOrders("/api/v1/orders/active");
}

export async function getOrdersHistory() {
  return fetchOrders("/api/v1/orders");
}
