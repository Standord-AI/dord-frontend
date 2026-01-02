import { getFeaturedProducts } from "@/app/actions/products";
import { getTenant } from "@/app/actions/tenant";
import { CatalogueDesignClient } from "./client";
import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { Tenant } from "@/global-types";

export default async function CatalogueDesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let featuredProducts = [];
  let tenant: Tenant | null = null;
  let error = null;

  try {
    // 1. Get Tenant ID from Token
    const cookieStore = await cookies();
    const token = cookieStore.get("Authorization")?.value;
    let tenantId = "";

    if (token) {
      const decoded = decodeJwt(token);
      tenantId = decoded?.tenant_id || "";
    }

    // 2. Fetch Featured Products and Tenant in parallel
    const [productsData, tenantData] = await Promise.all([
      getFeaturedProducts(),
      tenantId ? getTenant(tenantId) : Promise.resolve(null),
    ]);

    featuredProducts = productsData.products || [];
    tenant = tenantData;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load data";
    console.error("Error loading catalogue design page data:", e);
  }

  if (error || !tenant) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          Error loading page data: {error || "Tenant not found"}
        </div>
      </div>
    );
  }

  return (
    <CatalogueDesignClient
      initialFeaturedProducts={featuredProducts}
      slug={slug}
      tenant={tenant}
    />
  );
}
