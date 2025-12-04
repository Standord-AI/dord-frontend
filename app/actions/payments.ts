"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { Payment } from "@/global-types";

const getPaymentServiceUrl = () =>
  process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

export async function getPayments(): Promise<{
  payments: Payment[];
  error?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return { payments: [], error: "Unauthorized: No token found" };
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.tenant_id) {
    return { payments: [], error: "Unauthorized: Invalid token" };
  }

  const paymentServiceUrl = getPaymentServiceUrl();

  try {
    const res = await fetch(`${paymentServiceUrl}/api/v1/payments`, {
      headers: {
        "Tenant-ID": payload.tenant_id,
        Cookie: `Authorization=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch payments:", res.status, res.statusText);
      return {
        payments: [],
        error: `Error fetching payments: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return { payments: data.payments || [] };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return {
      payments: [],
      error: "Error loading payments. Please try again later.",
    };
  }
}

export async function getPendingPayments(): Promise<{
  payments: Payment[];
  error?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return { payments: [], error: "Unauthorized: No token found" };
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.tenant_id) {
    return { payments: [], error: "Unauthorized: Invalid token" };
  }

  const paymentServiceUrl = getPaymentServiceUrl();

  try {
    const res = await fetch(
      `${paymentServiceUrl}/api/v1/payments/pending-review`,
      {
        headers: {
          "Tenant-ID": payload.tenant_id,
          Cookie: `Authorization=${token}`,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(
        "Failed to fetch pending payments:",
        res.status,
        res.statusText
      );
      return {
        payments: [],
        error: `Error fetching pending payments: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return { payments: data.payments || [] };
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    return {
      payments: [],
      error: "Error loading pending payments. Please try again later.",
    };
  }
}
