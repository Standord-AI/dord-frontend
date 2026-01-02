"use client";

import { Product } from "@/global-types";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButton } from "@/components/delete-button";
import { EditProductDialog } from "@/components/products/edit-product-dialog";
import { deleteProduct } from "@/app/actions/products";

interface ProductCardProps {
  product: Product;
  slug: string;
}

export function ProductCard({ product, slug }: ProductCardProps) {
  const mainImage =
    product.Images?.find((img) => img.IsMain) || product.Images?.[0];
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="relative group">
      <Link
        href={`/admin/dashboard/${slug}/inventory/products/${product.ID}/varients`}
        className="block p-4 border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:bg-muted/30"
      >
        <div className="flex gap-4">
          {/* Left: Image */}
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
            {mainImage ? (
              <>
                {isImageLoading && (
                  <Skeleton className="absolute inset-0 z-10" />
                )}
                <Image
                  src={mainImage.URL}
                  alt={product.Name}
                  className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-110 ${
                    isImageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  fill
                  sizes="80px"
                  quality={60}
                  onLoad={() => setIsImageLoading(false)}
                />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <span className="text-xs">No Img</span>
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h2 className="font-semibold">{product.Name}</h2>
              <p className="line-clamp-1 text-sm text-gray-500">
                {product.Description}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-medium">${product.Price}</span>
              <span className="text-sm text-gray-500">
                Stock: {product.Stock}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <EditProductDialog product={product} />
        <DeleteButton
          id={product.ID}
          action={deleteProduct}
          resourceName={product.Name}
          description="all its variants"
          className="h-8 w-8"
        />
      </div>
    </div>
  );
}
