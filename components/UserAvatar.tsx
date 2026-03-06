"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { ROUTES } from "@/constants/routes";
import { CldImage } from "next-cloudinary";

interface Props {
  id?: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className = "h-9 w-9",
  fallbackClassName,
}: Props) => {
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={ROUTES.PROFILE} className="w-fit overflow-hidden rounded-full">
      <Avatar className={cn("relative", className)}>
        {imageUrl ? (
          <CldImage
            src={imageUrl}
            alt={name}
            className="object-cover"
            fill
            quality={70}
          />
        ) : (
          <AvatarFallback
            className={cn(
              "bg-primary font-space-grotesk font-bold tracking-wider text-white",
              fallbackClassName,
            )}
          >
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
