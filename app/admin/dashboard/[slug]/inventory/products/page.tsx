import { Product } from "@/global-types";
import { ProductCard } from "@/components/products/product-card";
import { CreateProductDialog } from "@/components/products/create-product-dialog";
import { getProducts } from "@/app/actions/products";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let products: Product[] = [];
  let error = null;

  try {
    const data = await getProducts();
    products = data.products || [];
  } catch (e) {
    error = e instanceof Error ? e.message : "An error occurred";
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <CreateProductDialog />
      </div>
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          Error: {error}
        </div>
      )}

      <div className="grid gap-4">
        {products && products.length > 0
          ? products.map((product) => (
              <ProductCard key={product.ID} product={product} slug={slug} />
            ))
          : !error && <p>No products found.</p>}
      </div>
    </div>
  );
}
