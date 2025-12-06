"use client";

import { useState } from "react";
import { Product } from "@/global-types";
import { FeaturedProductsManager } from "@/components/storefront/featured-products-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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
    imageType: "background", // or "product"
  },
  {
    id: "pure-flave",
    name: "Pure Flave",
    description:
      "A clean, split-layout design focusing on product details and minimalism.",
    image: "/ui-designs/hero-ui-2.png",
    imageType: "product",
  },
  {
    id: "modern-chic",
    name: "Modern Chic",
    description: "Elegant and sophisticated design for high-end brands.",
    image: "/ui-designs/hero-ui-3.png",
    imageType: "background",
  },
  {
    id: "urban-style",
    name: "Urban Style",
    description: "Bold and edgy design for streetwear and lifestyle brands.",
    image: "/ui-designs/hero-ui-4.png",
    imageType: "product",
  },
];

export function CatalogueDesignClient({
  initialFeaturedProducts,
  slug,
}: CatalogueDesignClientProps) {
  const [selectedDesign, setSelectedDesign] = useState("summer-collection");
  const [savedDesign, setSavedDesign] = useState("summer-collection");
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [savedBannerImage, setSavedBannerImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSavedDesign(selectedDesign);
    setSavedBannerImage(bannerImage);
    toast.success("Design saved successfully");
    setIsSaving(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const hasChanges =
    selectedDesign !== savedDesign || bannerImage !== savedBannerImage;

  const currentDesign = DESIGNS.find((d) => d.id === selectedDesign);

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
        <h2 className="text-xl font-semibold">
          {currentDesign?.imageType === "product"
            ? "Hero Product Image"
            : "Banner Background Image"}
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 space-y-4 hover:bg-accent/50 transition-colors">
              {bannerImage ? (
                <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={bannerImage}
                    alt="Banner Preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setBannerImage(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Image
                      src="/placeholder.svg" // We might not have this, so maybe use an icon
                      width={40}
                      height={40}
                      alt="Upload"
                      className="opacity-50"
                      onError={(e) => {
                        // Fallback if image fails, though we are using lucide icon below actually
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <Save className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium">
                      Click to upload{" "}
                      {currentDesign?.imageType === "product"
                        ? "a product image"
                        : "a background image"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 2MB)
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="banner-upload"
                    onChange={handleImageUpload}
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="banner-upload" className="cursor-pointer">
                      Select File
                    </label>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
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
