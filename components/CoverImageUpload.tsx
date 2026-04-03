import { MAX_FILE_SIZE } from "@/constants";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface UploadWidgetValue {
  url: string;
  publicId: string;
  sizeBytes?: number;
  mimeType?: string;
}

interface CoverImageUploadProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
  className?: string;
}

interface CloudinaryWidgetOptions {
  cloudName: string | undefined;
  uploadPreset: string | undefined;
  multiple: boolean;
  folder: string;
  maxFileSize: number;
  clientAllowedFormats: string[];
}

interface CloudinaryWidgetResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    bytes: number;
    format: string;
    resource_type: string;
  };
}

interface CloudinaryWidget {
  open: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: CloudinaryWidgetOptions,
        callback: (
          error: string | null,
          result: CloudinaryWidgetResult,
        ) => void,
      ) => CloudinaryWidget;
    };
  }
}

const CoverImageUpload = ({
  value = null,
  onChange,
  disabled,
  className = "",
}: CoverImageUploadProps) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);
  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "lms",
          maxFileSize: MAX_FILE_SIZE,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
              sizeBytes: result.info.bytes,
              mimeType: `image/${result.info.format}`,
            };
            setPreview(payload);
            onChangeRef.current?.(payload);
          }
        },
      );
      return true;
    };

    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled) {
      if (
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      ) {
        console.warn(
          "Cloudinary is not configured. Please set environment variables.",
        );
        return;
      }
      widgetRef.current?.open();
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChangeRef.current?.(null);
  };

  return (
    <div
      className={`relative w-full h-48 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/25 ${className}`}
    >
      {preview ? (
        <>
          <Image src={preview.url} alt="Cover" fill className="object-cover" />
          {!disabled && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                className="bg-background/80 backdrop-blur-sm rounded p-1 hover:bg-background/90 transition-colors"
                onClick={openWidget}
              >
                <Upload className="w-3 h-3" />
              </button>
              <button
                type="button"
                className="bg-background/80 backdrop-blur-sm rounded p-1 hover:bg-background/90 transition-colors"
                onClick={removeImage}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={openWidget}
        >
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">No cover image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverImageUpload;
