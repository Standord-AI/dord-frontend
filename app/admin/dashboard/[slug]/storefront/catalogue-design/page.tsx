import { getFeaturedProducts } from "@/app/actions/products";
import { CatalogueDesignClient } from "./client";

export default async function CatalogueDesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let featuredProducts = [];
  let error = null;

  try {
    const data = await getFeaturedProducts();
    featuredProducts = data.products || [];
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load featured products";
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          Error loading featured products: {error}
        </div>
      </div>
    );
  }

  return (
    <CatalogueDesignClient
      initialFeaturedProducts={featuredProducts}
      slug={slug}
    />
  );
}
