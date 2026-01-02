"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { AbandonedCart } from "@/global-types";

export async function getAbandonedCarts(hours: number = 1): Promise<{
  carts: AbandonedCart[];
  error?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return { carts: [], error: "Unauthorized: No token found" };
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.tenant_id) {
    return { carts: [], error: "Unauthorized: Invalid token" };
  }

  const cartServiceUrl =
    process.env.CART_SERVICE_URL || "http://localhost:3002";

  try {
    const res = await fetch(
      `${cartServiceUrl}/api/v1/carts/abandoned?hours=${hours}`,
      {
        headers: {
          "Tenant-ID": payload.tenant_id,
          Cookie: `Authorization=${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(
        "Failed to fetch abandoned carts:",
        res.status,
        res.statusText
      );
      return {
        carts: [],
        error: `Error fetching abandoned carts: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return { carts: data.carts || [] };
  } catch (error) {
    console.error("Error fetching abandoned carts:", error);
    return {
      carts: [],
      error: "Error loading abandoned carts. Please try again later.",
    };
  }
}
