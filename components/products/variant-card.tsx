"use client";

import { ProductVariant } from "@/global-types";
import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButton } from "@/components/delete-button";
import { deleteVariant } from "@/app/actions/variants";
import { EditVariantDialog } from "@/components/products/edit-variant-dialog";

interface VariantCardProps {
  variant: ProductVariant;
  productId: string;
}

export function VariantCard({ variant, productId }: VariantCardProps) {
  const mainImage =
    variant.Images?.find((img) => img.IsMain) || variant.Images?.[0];
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="relative group border rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:bg-muted/30">
      <div className="p-4 flex gap-4">
        {/* Left: Image */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
          {mainImage ? (
            <>
              {isImageLoading && <Skeleton className="absolute inset-0 z-10" />}
              <Image
                src={mainImage.URL}
                alt={variant.VariantName}
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
            <h2 className="font-semibold">{variant.VariantName}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="line-through text-xs opacity-60 hidden">
                {/* Original price logic if needed */}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-medium">${variant.PriceOverride}</span>
            <span className="text-sm text-gray-500">
              Stock: {variant.Stock}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <EditVariantDialog productVariant={variant} productId={productId} />
        <DeleteButton
          id={variant.ID}
          action={(id) => deleteVariant(productId, id)}
          resourceName={variant.VariantName}
          description="this variant"
          className="h-8 w-8"
        />
      </div>
    </div>
  );
}
