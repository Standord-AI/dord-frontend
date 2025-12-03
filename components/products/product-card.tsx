import { Product } from "@/global-types";

import Link from "next/link";

interface ProductCardProps {
  product: Product;
  slug: string;
}

export function ProductCard({ product, slug }: ProductCardProps) {
  return (
    <Link
      href={`/admin/dashboard/${slug}/inventory/products/${product.ID}/varients`}
      className="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <h2 className="font-semibold">{product.Name}</h2>
      <p className="text-sm text-gray-500">{product.Description}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="font-medium">${product.Price}</span>
        <span className="text-sm text-gray-500">Stock: {product.Stock}</span>
      </div>
    </Link>
  );
}
