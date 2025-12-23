"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash, Upload, Star } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface GenericImage {
  ID: number;
  URL: string;
  IsMain: boolean;
  ImageDescription?: string;
}

interface ImageManagerProps<T extends GenericImage> {
  images: T[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (image: T) => Promise<void>;
  onSetMain: (image: T) => Promise<void>;
}

export function ImageManager<T extends GenericImage>({
  images,
  onUpload,
  onDelete,
  onSetMain,
}: ImageManagerProps<T>) {
  const [isUploading, setIsUploading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteClick = async (image: T) => {
    setLoadingId(image.ID);
    try {
      await onDelete(image);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSetMainClick = async (image: T) => {
    if (image.IsMain) return;
    setLoadingId(image.ID);
    try {
      await onSetMain(image);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-medium">Images</h3>
        <div className="flex flex-wrap gap-4">
          {images.map((img) => (
            <ImageItem
              key={img.ID}
              img={img}
              handleSetMain={handleSetMainClick}
              handleDelete={handleDeleteClick}
              loadingId={loadingId}
            />
          ))}

          <div className="relative flex h-24 w-24 items-center justify-center rounded-md border border-dashed hover:bg-gray-50">
            <Label
              htmlFor="image-upload-generic"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500">Add</span>
                </>
              )}
              <Input
                id="image-upload-generic"
                type="file"
                className="hidden"
                onChange={handleUploadChange}
                accept="image/*"
                disabled={isUploading}
              />
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageItem<T extends GenericImage>({
  img,
  handleSetMain,
  handleDelete,
  loadingId,
}: {
  img: T;
  handleSetMain: (img: T) => void;
  handleDelete: (img: T) => void;
  loadingId: number | null;
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="group relative h-24 w-24 overflow-hidden rounded-md border bg-gray-100">
      {isImageLoading && <Skeleton className="absolute inset-0 z-10" />}
      <Image
        src={img.URL}
        alt={img.ImageDescription || "Product image"}
        className={`object-cover transition-opacity duration-300 ${
          isImageLoading ? "opacity-0" : "opacity-100"
        }`}
        fill
        sizes="96px"
        quality={60}
        onLoad={() => setIsImageLoading(false)}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
        <Button
          size="icon"
          variant={img.IsMain ? "default" : "secondary"}
          className="h-6 w-6"
          onClick={() => handleSetMain(img)}
          title="Set as Main"
          disabled={loadingId === img.ID}
        >
          <Star className={`h-3 w-3 ${img.IsMain ? "fill-white" : ""}`} />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
              className="h-6 w-6"
              disabled={loadingId === img.ID}
              title="Delete"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                image.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(img);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {loadingId === img.ID && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        </div>
      )}
      {img.IsMain && (
        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1 rounded z-10">
          Main
        </div>
      )}
    </div>
  );
}
