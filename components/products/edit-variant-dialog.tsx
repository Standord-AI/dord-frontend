"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { updateVariant } from "@/app/actions/variants";
import { toast } from "sonner";
import {
  ProductVariant,
  UpdateVariantPayload,
  ProductVariantImage,
} from "@/global-types";
import { ImageManager } from "@/components/products/image-manager";
import {
  addVariantImage,
  deleteVariantImage,
  setMainVariantImage,
} from "@/app/actions/variants";

interface EditVariantDialogProps {
  productVariant: ProductVariant;
  productId: string;
}

export function EditVariantDialog({
  productVariant,
  productId,
}: EditVariantDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize state with variant data
  const [variantName, setVariantName] = useState(productVariant.VariantName);
  const [priceOverride, setPriceOverride] = useState(
    productVariant.PriceOverride.toString()
  );
  const [stock, setStock] = useState(productVariant.Stock.toString());

  const images = (productVariant.Images || []).map((img) => ({
    ...img,
    URL: img.URL,
    ID: img.ID,
    IsMain: img.IsMain,
    ImageDescription: img.ImageDescription,
  }));

  useEffect(() => {
    if (open) {
      setVariantName(productVariant.VariantName);
      setPriceOverride(productVariant.PriceOverride.toString());
      setStock(productVariant.Stock.toString());
    }
  }, [open, productVariant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: UpdateVariantPayload = {
      variantName: variantName,
      price: parseFloat(priceOverride),
      stock: parseInt(stock),
    };

    const res = await updateVariant(productId, productVariant.ID, payload);

    setLoading(false);
    if (res.success) {
      setOpen(false);
      toast.success("Variant updated successfully");
    } else {
      toast.error(res.error || "Failed to update variant");
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      throw new Error(uploadData.error || "Upload failed");
    }

    const res = await addVariantImage(productId, productVariant.ID, {
      url: uploadData.url,
      is_main: images.length === 0,
      image_description: file.name,
    });

    if (res.success) {
      toast.success("Image added successfully");
    } else {
      toast.error(res.error || "Failed to add image to variant");
    }
  };

  const handleImageDelete = async (image: ProductVariantImage) => {
    const res = await deleteVariantImage(
      productId,
      productVariant.ID,
      image.ID,
      image.URL
    );
    if (res.success) {
      toast.success("Image deleted successfully");
    } else {
      toast.error(res.error || "Failed to delete image");
    }
  };

  const handleImageSetMain = async (image: ProductVariantImage) => {
    const res = await setMainVariantImage(
      productId,
      productVariant.ID,
      image.ID
    );
    if (res.success) {
      toast.success("Main image set successfully");
    } else {
      toast.error(res.error || "Failed to set main image");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
          <DialogDescription>
            Make changes to the variant details here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Images</Label>
            <div className="col-span-3">
              <ImageManager
                images={images}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
                onSetMain={handleImageSetMain}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-variant-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-variant-name"
                value={variantName}
                placeholder="Variant Name"
                onChange={(e) => setVariantName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-variant-price" className="text-right">
                Price
              </Label>
              <Input
                id="edit-variant-price"
                type="number"
                step="0.01"
                placeholder="Price Override"
                value={priceOverride}
                onChange={(e) => setPriceOverride(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-variant-stock" className="text-right">
                Stock
              </Label>
              <Input
                id="edit-variant-stock"
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
