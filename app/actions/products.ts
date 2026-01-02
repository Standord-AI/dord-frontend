"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import {
  CreateProductPayload,
  UpdateProductPayload,
  ImagePayload,
  UpdateImagePayload,
} from "@/global-types";
import { bucket } from "@/lib/firebase-admin";

// Removed duplicate import

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

// ... (existing createProduct code)

export async function updateProduct(id: number, data: UpdateProductPayload) {
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

export async function deleteProduct(id: number) {
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/id/${id}/delete`,
      {
        method: "DELETE",
        headers: {
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to delete product",
      };
    }

    revalidatePath("/admin/dashboard/[slug]/inventory/products", "page");
    return { success: true };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function addProductImage(id: number, data: ImagePayload) {
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${id}/images`,
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
        error: errorData.message || "Failed to add image",
      };
    }

    revalidatePath("/admin/dashboard/[slug]/inventory/products", "page");
    return { success: true };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateProductImage(
  productId: number,
  imageId: number,
  data: UpdateImagePayload
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/images/${imageId}`,
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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to update image",
      };
    }

    revalidatePath("/admin/dashboard/[slug]/inventory/products", "page");
    return { success: true };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteProductImage(
  productId: number,
  imageId: number,
  imageUrl: string
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          "Tenant-ID": tenantId,
          Cookie: `Authorization=${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to delete image",
      };
    }

    // Delete from Firebase Storage
    if (imageUrl) {
      try {
        // Extract file path from URL
        // URL format: https://storage.googleapis.com/BUCKET_NAME/products/FILENAME
        const urlParts = imageUrl.split("/o/");
        if (urlParts.length > 1) {
          const filePath = decodeURIComponent(urlParts[1].split("?")[0]); // Decode and remove query params
          await bucket.file(filePath).delete();
        } else {
          // Try alternate format if custom domain or different structure
          // Assuming default firebase structure where name is after bucket name
          const filename = imageUrl.split("/").pop()?.split("?")[0];
          if (filename) {
            // This is a naive fallback and might need adjustment based on exact URL structure
            // but the split('/o/') is the standard way to get object path from Firebase/GCS public URLs.
            // If we can't reliably get the path, we might log it.
          }
        }
      } catch (firebaseError) {
        console.error("Failed to delete image from Firebase:", firebaseError);
        // We don't return failure here because the backend deletion was successful
      }
    }

    revalidatePath("/admin/dashboard/[slug]/inventory/products", "page");
    return { success: true };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}
