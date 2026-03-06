"use client";

import { CldImage } from "next-cloudinary";

const CloudinaryImage = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  return (
    <CldImage
      alt={alt}
      src={src}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default CloudinaryImage;
