"use client";

import { Product, ProductImage } from "@/global-types";
import {
  addProductImage,
  deleteProductImage,
  updateProductImage,
} from "@/app/actions/products";
import { toast } from "sonner";
import { ImageManager } from "@/components/products/image-manager";

interface ProductImageManagerProps {
  product: Product;
}

export function ProductImageManager({ product }: ProductImageManagerProps) {
  const images = (product.Images || []).map((img) => ({
    ...img,
    // Ensure compatibility with GenericImage interface
    URL: img.URL,
    ID: img.ID,
    IsMain: img.IsMain,
    ImageDescription: img.ImageDescription,
  }));

  const handleUpload = async (file: File) => {
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

    const res = await addProductImage(product.ID, {
      url: uploadData.url,
      is_main: images.length === 0,
      image_description: file.name,
    });

    if (res.success) {
      toast.success("Image added successfully");
    } else {
      toast.error(res.error || "Failed to add image to product");
    }
  };

  const handleDelete = async (image: ProductImage) => {
    const res = await deleteProductImage(product.ID, image.ID, image.URL);
    if (res.success) {
      toast.success("Image deleted successfully");
    } else {
      toast.error(res.error || "Failed to delete image");
    }
  };

  const handleSetMain = async (image: ProductImage) => {
    const res = await updateProductImage(product.ID, image.ID, {
      is_main: true,
    });
    if (res.success) {
      toast.success("Main image updated");
    } else {
      toast.error(res.error || "Failed to update main image");
    }
  };

  return (
    <ImageManager
      images={images}
      onUpload={handleUpload}
      onDelete={handleDelete}
      onSetMain={handleSetMain}
    />
  );
}
