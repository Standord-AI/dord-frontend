import { getTenant, getBankAccounts } from "@/app/actions/tenant";
import { decodeJwt } from "@/lib/utils";
import { cookies } from "next/headers";
import { StoreInfo } from "@/components/store-settings/store-info";
import { ContactDetails } from "@/components/store-settings/contact-details";
import { BrandingDetails } from "@/components/store-settings/branding-details";
import { PaymentDetails } from "@/components/store-settings/payment-details";
import { TenantSettings } from "@/global-types";

export default async function StoreSettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;

  if (!token) {
    return <div className="p-6">Unauthorized: No token found</div>;
  }

  const payload = decodeJwt(token);
  if (!payload || !payload.tenant_id) {
    return <div className="p-6">Unauthorized: Invalid token</div>;
  }

  const [tenantData, bankAccountsData] = await Promise.all([
    getTenant(payload.tenant_id),
    getBankAccounts(),
  ]);

  if (!tenantData) {
    return <div className="p-6">Error loading store settings.</div>;
  }

  // Map the data to TenantSettings manually since keys differ (CamelCase vs snake_case)
  const settings: TenantSettings = {
    tenant_id: tenantData.TenantID,
    name: tenantData.Name,
    slug: tenantData.Slug,
    owner_id: tenantData.OwnerID,
    business_email: tenantData.BusinessEmail,
    business_phone: tenantData.BusinessPhone,
    description: tenantData.Description,
    plan_type: tenantData.PlanType,
    logo_url: tenantData.LogoURL || "",
    banner_url: tenantData.BannerURL || "",
    primary_color: tenantData.PrimaryColor || "",
    secondary_color: tenantData.SecondaryColor || "",
    accent_color: tenantData.AccentColor || "",
    business_address: {
      address1: tenantData.BusinessAddress?.address1 || "",
      address2: tenantData.BusinessAddress?.address2 || "",
      city: tenantData.BusinessAddress?.city || "",
      state: "", // Address interface doesn't have state, default to empty
      zip: tenantData.BusinessAddress?.zip || "",
      country: tenantData.BusinessAddress?.country || "",
    },
    is_active: tenantData.IsActive,
  };
  const bankAccounts = bankAccountsData.bank_accounts || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Store Settings</h1>
      </div>

      <div className="grid gap-6">
        <StoreInfo settings={settings} />
        <ContactDetails settings={settings} />
        <BrandingDetails settings={settings} />
        <PaymentDetails bankAccounts={bankAccounts} />
      </div>
    </div>
  );
}
