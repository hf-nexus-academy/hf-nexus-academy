"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Upload, X, ImageOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ImageUploadFolder = "teachers" | "courses" | "blog" | "site";

export function ImageUpload({
  label,
  folder,
  value,
  onChange,
  aspectClassName = "aspect-video",
}: {
  label: string;
  folder: ImageUploadFolder;
  value: string | null | undefined;
  onChange: (url: string) => void;
  aspectClassName?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState(false);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not upload image.");
        return;
      }

      setPreviewError(false);
      onChange(data.url);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>

      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-md border border-ink-300/20 bg-cream-100 ${aspectClassName}`}
      >
        {value && !previewError ? (
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            onError={() => setPreviewError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-300">
            <ImageOff className="h-6 w-6" />
            <span className="text-xs">No image yet</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-950/50">
            <Loader2 className="h-5 w-5 animate-spin text-cream-50" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {value ? "Replace Image" : "Upload Image"}
        </Button>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isUploading}
            onClick={() => {
              onChange("");
              setPreviewError(false);
            }}
          >
            <X className="h-4 w-4" /> Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-ink-500">JPG, PNG, WEBP, or AVIF. Max 5MB.</p>
    </div>
  );
}
