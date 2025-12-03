"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Upload, X, ImageIcon, Check, CloudUpload, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CustomImage } from "@/components/ui/custom-image";

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = "image/*",
  disabled = false,
  error,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        return `${file.name} is not an image file`;
      }

      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        return `${file.name} exceeds ${maxSizeMB}MB limit`;
      }

      return null;
    },
    [maxSizeMB]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const fileArray = Array.from(files);
      const newFiles: File[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        // Check if we've reached max files
        if (value.length + newFiles.length >= maxFiles) {
          errors.push(`Maximum ${maxFiles} files allowed`);
          break;
        }

        // Validate file
        const error = validateFile(file);
        if (error) {
          errors.push(error);
          continue;
        }

        newFiles.push(file);
      }

      if (errors.length > 0) {
        console.error("File upload errors:", errors);
        // You could show these errors in a toast notification
      }

      if (newFiles.length > 0) {
        // Simulate upload progress animation
        const fileNames = newFiles.map((f) => f.name);
        setUploadingFiles(fileNames);
        setUploadProgress(0);

        // Animate progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 20;
          });
        }, 80);

        // Complete upload
        setTimeout(() => {
          clearInterval(progressInterval);
          setUploadProgress(100);
          setTimeout(() => {
            onChange([...value, ...newFiles]);
            setUploadingFiles([]);
            setUploadProgress(0);
          }, 200);
        }, 500);
      }
    },
    [value, onChange, maxFiles, validateFile, disabled]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange(newFiles);
    },
    [value, onChange]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input value so same file can be selected again
      e.target.value = "";
    },
    [handleFiles]
  );

  const isMaxReached = value.length >= maxFiles;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Area */}
      {!isMaxReached && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-xl border-2 border-dashed transition-all overflow-hidden duration-200",
            isDragging
              ? "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 scale-[1.02]"
              : error
              ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
              : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "hover:border-orange-400 dark:hover:border-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-500/5"
          )}
        >
          {/* Background decoration when dragging */}
          {isDragging && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Animated gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-orange-400/20 animate-pulse" />
              {/* Corner sparkles */}
              <div className="absolute top-3 left-3 animate-spin-slow motion-reduce:animate-none">
                <Sparkles className="w-4 h-4 text-orange-400/60" />
              </div>
              <div
                className="absolute top-3 right-3 animate-spin-slow motion-reduce:animate-none"
                style={{ animationDelay: "0.5s", animationDirection: "reverse" }}
              >
                <Sparkles className="w-4 h-4 text-amber-400/60" />
              </div>
            </div>
          )}

          <label
            htmlFor="image-upload"
            className={cn(
              "flex flex-col items-center justify-center py-8 sm:py-10 px-4 cursor-pointer relative z-10",
              disabled && "cursor-not-allowed"
            )}
            aria-label="Upload images - Click or drag and drop to add files"
          >
            <div
              className={cn(
                "rounded-full p-4 mb-4 transition-all duration-300",
                isDragging
                  ? "bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-500/20 dark:to-amber-500/20 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/10 -translate-y-1"
                  : "bg-slate-100 dark:bg-slate-800"
              )}
            >
              {isDragging ? (
                <CloudUpload className="w-8 h-8 text-orange-500" />
              ) : (
                <Upload className="w-8 h-8 text-slate-500 dark:text-slate-400" />
              )}
            </div>

            <p
              className={cn(
                "text-sm font-semibold mb-1.5 transition-all duration-300",
                isDragging
                  ? "text-orange-600 dark:text-orange-400 scale-105"
                  : "text-slate-700 dark:text-slate-300"
              )}
            >
              {isDragging ? "Drop your images here!" : "Click to upload or drag and drop"}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              PNG, JPG, GIF up to {maxSizeMB}MB
            </p>

            {/* File count indicator */}
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              <div className="flex -space-x-1">
                {Array.from({ length: maxFiles }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 transition-colors duration-200",
                      i < value.length
                        ? "bg-orange-400"
                        : "bg-slate-200 dark:bg-slate-700"
                    )}
                  />
                ))}
              </div>
              <span className="font-medium">
                {value.length}/{maxFiles} slots used
              </span>
            </div>

            <input
              id="image-upload"
              type="file"
              accept={accept}
              multiple
              onChange={handleFileInputChange}
              disabled={disabled}
              className="sr-only"
              aria-label={`Upload up to ${maxFiles} images, maximum ${maxSizeMB}MB each`}
            />
          </label>

          {/* Upload Progress Indicator */}
          {uploadingFiles.length > 0 && (
            <div
              className={cn(
                "absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl flex items-center justify-center z-20 transition-opacity duration-200",
                uploadingFiles.length > 0 ? "opacity-100" : "opacity-0"
              )}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex flex-col items-center gap-4 w-48 transition-all duration-200">
                {/* Progress circle */}
                <div className="relative w-16 h-16">
                  {/* Background circle */}
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      strokeWidth="4"
                      className="stroke-slate-200 dark:stroke-slate-700"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="stroke-orange-500 transition-all duration-100"
                      style={{
                        strokeDasharray: "175.93",
                        strokeDashoffset: 175.93 - (175.93 * uploadProgress / 100),
                      }}
                    />
                  </svg>
                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {uploadProgress < 100 ? (
                      <span className="text-sm font-bold text-orange-500 transition-all duration-150">
                        {uploadProgress}%
                      </span>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center transition-all duration-200 scale-100">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {uploadProgress < 100 ? "Uploading..." : "Done!"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {uploadingFiles.length} {uploadingFiles.length === 1 ? "file" : "files"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}

      {/* File Count Info */}
      {value.length > 0 && (
        <p
          className={cn(
            "text-xs text-slate-600 dark:text-slate-400 transition-all duration-200",
            value.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          )}
        >
          {value.length} of {maxFiles} files selected
        </p>
      )}

      {/* Preview Grid */}
      {value.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 transition-opacity duration-200",
            value.length > 0 ? "opacity-100" : "opacity-0"
          )}
          role="list"
          aria-label="Uploaded images"
        >
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="transition-all duration-200"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <ImagePreview
                file={file}
                onRemove={() => removeFile(index)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

function ImagePreview({ file, onRemove, disabled }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate preview URL
  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Cleanup function - no dependencies needed here as we're only cleaning up on unmount
    // FileReader creates data URLs, not blob URLs, so no cleanup is actually needed
    return () => {
      // Cleanup if needed in the future
    };
  }, [file]);

  return (
    <div
      className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 transition-transform duration-200 hover:scale-105"
      role="listitem"
    >
      {/* Image Preview */}
      {preview ? (
        <div
          className={cn(
            "w-full h-full transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <CustomImage
            src={preview}
            alt={`Preview of ${file.name}`}
            fill
            className="object-cover"
            onLoad={() => setIsLoaded(true)}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center transition-all duration-300">
          <ImageIcon className="w-8 h-8 text-slate-400" />
        </div>
      )}

      {/* Remove Button - Minimum 44x44px touch target */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={onRemove}
        disabled={disabled}
        className="absolute top-1 right-1 h-10 w-10 min-h-[44px] min-w-[44px] sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
      </Button>

      {/* File Name Overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 transition-all duration-300",
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        )}
        style={{ transitionDelay: "200ms" }}
      >
        <p className="text-xs text-white truncate">{file.name}</p>
      </div>
    </div>
  );
}
