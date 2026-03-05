ALTER TABLE "courses" ADD COLUMN "price" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "banner_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "duration" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "level" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "image";