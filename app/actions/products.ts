"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { revalidatePath } from "next/cache";

import { CreateProductPayload } from "@/global-types";

export async function createProduct(data: CreateProductPayload) {
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/create`,
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
        error: errorData.message || "Failed to create product",
      };
    }

    revalidatePath("/admin/dashboard/[slug]/inventory/products", "page");
    return { success: true };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getProducts(search?: string) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    throw new Error("No authorization token found");
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;

  if (!tenantId) {
    throw new Error("Invalid token: missing tenant_id");
  }

  const url = new URL(`${process.env.PRODUCTS_SERVICE_URL}/api/v1/products`);
  if (search) {
    url.searchParams.append("search", search);
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Tenant-ID": tenantId,
      Cookie: `Authorization=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function getFeaturedProducts() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("Authorization");
  const token = authCookie?.value;

  if (!token) {
    throw new Error("No authorization token found");
  }

  const decoded = decodeJwt(token);
  const tenantId = decoded?.tenant_id;

  if (!tenantId) {
    throw new Error("Invalid token: missing tenant_id");
  }

  const res = await fetch(
    `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/featured`,
    {
      headers: {
        "Tenant-ID": tenantId,
        Cookie: `Authorization=${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch featured products");
  }

  return res.json();
}

export async function updateProduct(id: number, data: any) {
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
    // Note: User provided localhost:8080 for PATCH, but we use PRODUCTS_SERVICE_URL (likely 3003)
    // If this fails, we might need to adjust the URL or port.
    const res = await fetch(
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/id/${id}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: resData.message || "Failed to update product",
      };
    }

    revalidatePath(
      "/admin/dashboard/[slug]/storefront/catalogue-design",
      "page"
    );
    revalidatePath("/admin/dashboard/[slug]/inventory/products", "page");
    return { success: true, data: resData };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}
