ALTER TABLE "users" ADD COLUMN "cover_cld_pub_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image_cld_pub_id" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "image";