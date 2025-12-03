import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";

import { ProductVariant } from "@/global-types";
import { CreateVariantDialog } from "@/components/products/create-variant-dialog";

async function getVariants(productId: string) {
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
    `${process.env.PRODUCTS_SERVICE_URL}/api/v1/products/${productId}/variants`,
    {
      headers: {
        "Tenant-ID": tenantId,
        Cookie: `Authorization=${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch variants");
  }

  return res.json();
}

export default async function ProductVarientsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let variants: ProductVariant[] = [];
  let error = null;

  try {
    const data = await getVariants(id);
    variants = data.productVariants || [];
  } catch (e) {
    error = e instanceof Error ? e.message : "An error occurred";
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Variants</h1>
        <CreateVariantDialog productId={id} />
      </div>
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          Error: {error}
        </div>
      )}

      <div className="grid gap-4">
        {variants && variants.length > 0
          ? variants.map((variant) => (
              <div key={variant.ID} className="p-4 border rounded-lg shadow-sm">
                <h2 className="font-semibold">{variant.VariantName}</h2>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-medium">${variant.PriceOverride}</span>
                  <span className="text-sm text-gray-500">
                    Stock: {variant.Stock}
                  </span>
                </div>
              </div>
            ))
          : !error && <p>No variants found.</p>}
      </div>
    </div>
  );
}
