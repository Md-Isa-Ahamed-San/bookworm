// ==========================================
// 📁 src/app/(auth)/register/_components/image-upload.tsx
// ==========================================
"use client";

import { useState, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onUploadComplete, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAbortController = useRef<AbortController | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);

    // Create abort controller for timeout
    uploadAbortController.current = new AbortController();
    const timeoutId = setTimeout(() => {
      uploadAbortController.current?.abort();
    }, 30000); // 30 second timeout

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profiles");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: uploadAbortController.current.signal,
      });
    //   console.log("🚀 ~ handleFileChange ~ response:", response)

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json() as { url: string };
      setPreviewUrl(data.url);
      onUploadComplete(data.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === "AbortError") {
        toast.error("Upload timed out. Please try again.");
      } else {
        console.error("Upload error:", error);
        toast.error("Failed to upload image. Please try again.");
      }
    } finally {
      setUploading(false);
      uploadAbortController.current = null;
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
        disabled={disabled || uploading}
        aria-label="Upload profile photo"
      />

      {!previewUrl ? (
        <label htmlFor="image-upload">
          <div 
            className={`
              cursor-pointer rounded-lg border-2 border-dashed border-border bg-card p-6 
              transition-colors hover:border-primary/50
              ${disabled || uploading ? 'cursor-not-allowed opacity-50' : ''}
            `}
            role="button"
            tabIndex={disabled || uploading ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-card-foreground">
                      Click to upload profile photo
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </label>
      ) : (
        <div className="relative">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">
                  Profile photo uploaded
                </p>
                <p className="text-xs text-muted-foreground">Ready to use</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove uploaded photo"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}