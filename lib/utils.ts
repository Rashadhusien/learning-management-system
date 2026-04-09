import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Video, Code, CheckCircle, FileText } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const constructCloudinaryUrl = (publicId: string): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    return "";
  }
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  return url;
};

export const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return Video;
    case "project":
      return Code;
    case "quiz":
      return CheckCircle;
    default:
      return FileText;
  }
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
};
