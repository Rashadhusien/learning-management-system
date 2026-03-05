import { CLOUDINARY_CLOUD_NAME } from "@/constants";
import { Cloudinary } from "@cloudinary/url-gen";
import { dpr, format, quality } from "@cloudinary/url-gen/actions/delivery";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Position } from "@cloudinary/url-gen/qualifiers";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { text } from "@cloudinary/url-gen/qualifiers/source";

import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";

if (!CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME environment variable is not set");
}

const cld = new Cloudinary({ cloud: { cloudName: CLOUDINARY_CLOUD_NAME } });

export const bannerPhoto = (imageCldPubId: string, name?: string) => {
  if (!imageCldPubId) {
    throw new Error("Image Cloudinary public ID is required");
  }

  return cld
    .image(imageCldPubId)
    .resize(fill())
    .delivery(format("auto"))
    .delivery(quality("auto"))
    .delivery(dpr("auto"));
};
