"use client";

import { useState } from "react";
import { Product } from "@/global-types";
import { FeaturedProductsManager } from "@/components/storefront/featured-products-manager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Save } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface CatalogueDesignClientProps {
  initialFeaturedProducts: Product[];
  slug: string;
}

const DESIGNS = [
  {
    id: "summer-collection",
    name: "Summer Collection",
    description:
      "A vibrant, full-screen hero design perfect for seasonal promotions.",
    image: "/ui-designs/hero-ui-1.png",
  },
  {
    id: "pure-flave",
    name: "Pure Flave",
    description:
      "A clean, split-layout design focusing on product details and minimalism.",
    image: "/ui-designs/hero-ui-2.png",
  },
  {
    id: "modern-chic",
    name: "Modern Chic",
    description: "Elegant and sophisticated design for high-end brands.",
    image: "/ui-designs/hero-ui-3.png",
  },
  {
    id: "urban-style",
    name: "Urban Style",
    description: "Bold and edgy design for streetwear and lifestyle brands.",
    image: "/ui-designs/hero-ui-4.png",
  },
];

export function CatalogueDesignClient({
  initialFeaturedProducts,
  slug,
}: CatalogueDesignClientProps) {
  const [selectedDesign, setSelectedDesign] = useState("summer-collection");
  const [savedDesign, setSavedDesign] = useState("summer-collection");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavedDesign(selectedDesign);
    toast.success("Design saved successfully");
    setIsSaving(false);
  };

  const hasChanges = selectedDesign !== savedDesign;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Catalogue Design
          </h1>
          <p className="text-muted-foreground">
            Manage your storefront's appearance and featured products.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Landing Page Design</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {DESIGNS.map((design) => (
            <Card
              key={design.id}
              className={`cursor-pointer transition-all relative overflow-hidden ${
                selectedDesign === design.id
                  ? "border-primary ring-2 ring-primary"
                  : "hover:border-primary/50 opacity-75 hover:opacity-100"
              }`}
              onClick={() => setSelectedDesign(design.id)}
            >
              {selectedDesign === design.id && (
                <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
              <div className="aspect-video relative bg-muted">
                <Image
                  src={design.image}
                  alt={design.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-base">{design.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {design.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <FeaturedProductsManager
          initialFeaturedProducts={initialFeaturedProducts}
          slug={slug}
        />
      </div>
    </div>
  );
}
