"use client";

import { useState, useTransition, useMemo } from "react";
import { Product } from "@/global-types";
import { updateProduct, getProducts } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, X, Star } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface FeaturedProductsManagerProps {
  initialFeaturedProducts: Product[];
  slug: string;
}

export function FeaturedProductsManager({
  initialFeaturedProducts,
  slug,
}: FeaturedProductsManagerProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(
    initialFeaturedProducts
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const [isUpdating, startUpdateTransition] = useTransition();
  const [isLoading, startLoading] = useTransition();

  const loadProducts = () => {
    startLoading(async () => {
      try {
        const data = await getProducts();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products", error);
        toast.error("Failed to load products");
      }
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setSearchQuery("");
      if (allProducts.length === 0) {
        loadProducts();
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const searchResults = useMemo(() => {
    return allProducts
      .filter((p) => !featuredProducts.some((fp) => fp.ID === p.ID))
      .filter(
        (p) =>
          !searchQuery ||
          p.Name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allProducts, featuredProducts, searchQuery]);

  const handleToggleFeatured = (product: Product, isFeatured: boolean) => {
    if (isFeatured && featuredProducts.length >= 5) {
      toast.error("Maximum of 5 featured products allowed");
      return;
    }

    startUpdateTransition(async () => {
      const result = await updateProduct(product.ID, {
        IsFeatured: isFeatured,
      });

      if (result.success) {
        if (isFeatured) {
          setFeaturedProducts([
            ...featuredProducts,
            { ...product, IsFeatured: true },
          ]);
          toast.success("Product added to featured");
          setIsDialogOpen(false);
        } else {
          setFeaturedProducts(
            featuredProducts.filter((p) => p.ID !== product.ID)
          );
          toast.success("Product removed from featured");
        }
      } else {
        toast.error(result.error || "Failed to update product");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Featured Products</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button disabled={featuredProducts.length >= 5}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product ({featuredProducts.length}/5)
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Featured Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {isLoading ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Loading...
                  </p>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.ID}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                    >
                      <div>
                        <p className="font-medium">{product.Name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${product.Price}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleToggleFeatured(product, true)}
                        disabled={isUpdating}
                      >
                        Add
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    No products found
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => (
            <Card key={product.ID} className="relative overflow-hidden group">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleToggleFeatured(product, false)}
                  disabled={isUpdating}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <CardContent className="p-3">
                <div className="aspect-square relative bg-muted rounded-md mb-2 overflow-hidden">
                  {product.Images && product.Images.length > 0 ? (
                    <Image
                      src={product.Images[0]}
                      alt={product.Name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                  {product.IsFeatured && (
                    <div className="absolute top-1 left-1 bg-yellow-500/90 text-white p-1 rounded-full shadow-sm">
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className="font-medium text-sm truncate"
                      title={product.Name}
                    >
                      {product.Name}
                    </h3>
                    <span className="font-bold text-sm whitespace-nowrap">
                      ${product.Price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.Category}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No featured products yet</p>
            <Button
              variant="link"
              onClick={() => setIsDialogOpen(true)}
              className="mt-2"
            >
              Add your first featured product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
