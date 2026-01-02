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
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateProduct } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { toast } from "sonner";
import { Category, Product, UpdateProductPayload } from "@/global-types";
import { ProductImageManager } from "@/components/products/product-image-manager";

interface EditProductDialogProps {
  product: Product;
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize state with product data
  const [name, setName] = useState(product.Name);
  const [description, setDescription] = useState(product.Description || "");
  const [category, setCategory] = useState(product.Category || "");
  const [price, setPrice] = useState(product.Price.toString());
  const [stock, setStock] = useState(product.Stock.toString());

  const [openCombobox, setOpenCombobox] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      // Sync state with prop if it changes outside (optional but good practice)
      setName(product.Name);
      setDescription(product.Description || "");
      setCategory(product.Category || "");
      setPrice(product.Price.toString());
      setStock(product.Stock.toString());

      const fetchCategories = async () => {
        const res = await getCategories();
        if (res.success && res.categories) {
          setCategories(res.categories);
        } else {
          toast.error("Failed to load categories");
        }
      };
      fetchCategories();
    }
  }, [open, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: UpdateProductPayload = {
      Name: name,
      Description: description,
      Category: category,
      Price: parseFloat(price),
      Stock: parseInt(stock),
      // Preserve existing values for optional fields if not edited here,
      // or send only changed fields. For now sending all form fields.
    };

    const res = await updateProduct(product.ID, payload);

    setLoading(false);
    if (res.success) {
      setOpen(false);
      toast.success("Product updated successfully");
    } else {
      toast.error(res.error || "Failed to update product");
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
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product details here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Images</Label>
            <div className="col-span-3">
              <ProductImageManager product={product} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              placeholder="Product Name"
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              placeholder="Product Description"
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">
              Category
            </Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-[200px] justify-between col-span-3"
                >
                  {category
                    ? categories.find((c) => c.Name === category)?.Name ||
                      category
                    : "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((c) => (
                        <CommandItem
                          key={c.ID}
                          value={c.Name}
                          onSelect={(currentValue) => {
                            setCategory(
                              currentValue === category ? "" : currentValue
                            );
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              category === c.Name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {c.Name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-price" className="text-right">
              Price
            </Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              placeholder="Product Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-stock" className="text-right">
              Stock
            </Label>
            <Input
              id="edit-stock"
              type="number"
              placeholder="No. of Products in Stock"
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
      </DialogContent>
    </Dialog>
  );
}
