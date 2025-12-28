"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { BankAccount } from "@/global-types";

export async function getTenant(tenantId: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${process.env.MERCHANT_SERVICE_URL}/api/v1/tenants/tenant/${tenantId}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        next: { tags: [`tenant-${tenantId}`] },
      }
    );

    console.log(`[getTenant] Fetching tenant ${tenantId}`);

    if (!response.ok) {
      console.error(
        `Failed to fetch tenant: ${response.status} ${response.statusText}`
      );
      throw new Error("Failed to fetch tenant");
    }

    const data = await response.json();
    const rawTenant = data.tenant;

    // Normalize snake_case to PascalCase to match Tenant interface
    const tenant: any = {
      ID: rawTenant.id ?? rawTenant.ID, // Handle potential case differences for ID
      CreatedAt: rawTenant.created_at ?? rawTenant.CreatedAt,
      UpdatedAt: rawTenant.updated_at ?? rawTenant.UpdatedAt,
      DeletedAt: rawTenant.deleted_at ?? rawTenant.DeletedAt,
      TenantID: rawTenant.tenant_id ?? rawTenant.TenantID,
      Name: rawTenant.name ?? rawTenant.Name,
      Slug: rawTenant.slug ?? rawTenant.Slug,
      OwnerID: rawTenant.owner_id ?? rawTenant.OwnerID,
      BusinessEmail: rawTenant.business_email ?? rawTenant.BusinessEmail,
      BusinessPhone: rawTenant.business_phone ?? rawTenant.BusinessPhone,
      Description: rawTenant.description ?? rawTenant.Description,
      IsActive: rawTenant.is_active ?? rawTenant.IsActive,
      PlanType: rawTenant.plan_type ?? rawTenant.PlanType,
      LogoURL: rawTenant.logo_url ?? rawTenant.LogoURL,
      BannerURL: rawTenant.banner_url ?? rawTenant.BannerURL,
      PrimaryColor: rawTenant.primary_color ?? rawTenant.PrimaryColor,
      SecondaryColor: rawTenant.secondary_color ?? rawTenant.SecondaryColor,
      AccentColor: rawTenant.accent_color ?? rawTenant.AccentColor,
      BusinessAddress: rawTenant.business_address ?? rawTenant.BusinessAddress, // Address keys might need normalization too if nested
      LandingPageDesign:
        rawTenant.landing_page_design ?? rawTenant.LandingPageDesign,
      SecondaryBannerURL:
        rawTenant.secondary_banner_url ?? rawTenant.SecondaryBannerURL,
      LandingPageTitle:
        rawTenant.landing_page_title ?? rawTenant.LandingPageTitle,
      LandingPageDescription:
        rawTenant.landing_page_description ?? rawTenant.LandingPageDescription,
    };

    return tenant;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }
}

export async function getBankAccounts(): Promise<{
  bank_accounts: BankAccount[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("Authorization")?.value;

    if (!token) {
      return { bank_accounts: [], error: "Unauthorized: No token found" };
    }

    const payload = decodeJwt(token);
    if (!payload || !payload.tenant_id) {
      return { bank_accounts: [], error: "Unauthorized: Invalid token" };
    }

    const response = await fetch(
      `${process.env.MERCHANT_SERVICE_URL}/api/v1/bank-accounts`,
      {
        headers: {
          "Tenant-ID": payload.tenant_id,
          Cookie: `Authorization=${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch bank accounts: ${response.status} ${response.statusText}`
      );
      return {
        bank_accounts: [],
        error: `Error fetching bank accounts: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { bank_accounts: data.bank_accounts || [] };
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return { bank_accounts: [], error: "Error loading bank accounts." };
  }
}

import { UpdateTenantPayload } from "@/global-types";
import { revalidatePath } from "next/cache";

// removed id parameter as it is not used in the new endpoint
export async function updateTenant(data: UpdateTenantPayload) {
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
    const url = `${process.env.MERCHANT_SERVICE_URL}/api/v1/tenants/partial`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Tenant-ID": tenantId,
        Cookie: `Authorization=${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: resData.message || "Failed to update tenant",
      };
    }

    revalidatePath(
      "/admin/dashboard/[slug]/storefront/catalogue-design",
      "page"
    );
    return { success: true, data: resData.tenant };
  } catch (e) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

import { bucket } from "@/lib/firebase-admin";

export async function uploadTenantImage(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `tenants/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const fileUpload = bucket.file(filename);

    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
