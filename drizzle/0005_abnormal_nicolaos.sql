ALTER TABLE "users" ALTER COLUMN "cover_cld_pub_id" SET DEFAULT 'default-cover';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image_cld_pub_id" SET DEFAULT 'default-avatar';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "image_cld_pub_id" text NOT NULL;