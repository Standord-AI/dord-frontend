"use client";

import { useState } from "react";
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
import { createVariant } from "@/app/actions/variants";
import { toast } from "sonner";

interface CreateVariantDialogProps {
  productId: string;
}

export function CreateVariantDialog({ productId }: CreateVariantDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variantName, setVariantName] = useState("");
  const [priceOverride, setPriceOverride] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      VariantName: variantName,
      PriceOverride: parseFloat(priceOverride),
      Stock: parseInt(stock),
    };

    const res = await createVariant(productId, payload);

    setLoading(false);
    if (res.success) {
      setOpen(false);
      toast.success("Variant created successfully");
      // Reset form
      setVariantName("");
      setPriceOverride("");
      setStock("");
    } else {
      toast.error(res.error || "Failed to create variant");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Variant</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Variant</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new variant for this product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="variantName" className="text-right">
              Name
            </Label>
            <Input
              id="variantName"
              value={variantName}
              placeholder="Variant Name (e.g., Large)"
              onChange={(e) => setVariantName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priceOverride" className="text-right">
              Price
            </Label>
            <Input
              id="priceOverride"
              type="number"
              step="0.01"
              value={priceOverride}
              placeholder="Price Override"
              onChange={(e) => setPriceOverride(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              placeholder="Stock"
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
      </DialogContent>
    </Dialog>
  );
}
