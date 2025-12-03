"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { CreateVariantPayload } from "@/global-types";

export async function createVariant(
  productId: string,
  data: CreateVariantPayload
) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    return { success: false, error: "No authorization token found" };
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;

  if (!tenantId) {
    return { success: false, error: "Invalid token: missing tenant_id" };
  }

  try {
    const res = await fetch(
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/variants/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to create variant",
      };
    }

    revalidatePath(
      "/admin/dashboard/[slug]/inventory/products/[id]/varients",
      "page"
    );
    return { success: true };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}
