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

import { UpdateVariantPayload } from "@/global-types";

export async function updateVariant(
  productId: string,
  variantId: number,
  data: UpdateVariantPayload
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/variants/${variantId}`,
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
        error: resData.message || "Failed to update variant",
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

export async function deleteVariant(productId: string, variantId: number) {
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/variants/${variantId}`,
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
        error: errorData.message || "Failed to delete variant",
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

import { ImagePayload } from "@/global-types";
// @ts-ignore
import { bucket } from "@/lib/firebase-admin";

export async function addVariantImage(
  productId: string,
  variantId: number,
  data: ImagePayload
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/variants/${variantId}/images`,
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
        error: errorData.message || "Failed to add variant image",
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

export async function setMainVariantImage(
  productId: string,
  variantId: number,
  imageId: number
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/variants/${variantId}/images/${imageId}/set-main`,
      {
        method: "POST",
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
        error: errorData.message || "Failed to set main variant image",
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

export async function deleteVariantImage(
  productId: string,
  variantId: number,
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
      `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/variants/${variantId}/images/${imageId}`,
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
        error: errorData.message || "Failed to delete variant image",
      };
    }

    // Delete from Firebase Storage
    if (imageUrl) {
      try {
        const urlParts = imageUrl.split("/o/");
        if (urlParts.length > 1) {
          const filePath = decodeURIComponent(urlParts[1].split("?")[0]);
          await bucket.file(filePath).delete();
        }
      } catch (firebaseError) {
        console.error("Failed to delete image from Firebase:", firebaseError);
      }
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
