import { MAX_FILE_SIZE } from "@/constants";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface UploadWidgetValue {
  url: string;
  publicId: string;
  sizeBytes?: number;
  mimeType?: string;
}

interface ProfileImageUploadProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
  className?: string;
  userName?: string;
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

const ProfileImageUpload = ({
  value = null,
  onChange,
  disabled,
  className = "",
  userName = "",
}: ProfileImageUploadProps) => {
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
          folder: "lms/",
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
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        <Avatar className="w-20 h-20">
          <AvatarImage src={preview?.url || undefined} />
          <AvatarFallback className="text-sm">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="rounded-full w-6 h-6 p-0"
            onClick={openWidget}
            disabled={disabled}
          >
            <Camera className="w-3 h-3" />
          </Button>
        </div>
        {preview && !disabled && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-1 -right-1 rounded-full w-5 h-5 p-0"
            onClick={removeImage}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        Upload a new profile picture. Recommended size: 200x200px.
      </div>
    </div>
  );
};

export default ProfileImageUpload;
