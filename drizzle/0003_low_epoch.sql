CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "category_id" uuid;--> statement-breakpoint
INSERT INTO "categories" ("id", "name", "description", "icon", "is_deleted", "created_at", "updated_at") VALUES ('00000000-0000-0000-0000-000000000000', 'General', 'General category for uncategorized courses', NULL, false, now(), now());--> statement-breakpoint
UPDATE "courses" SET "category_id" = '00000000-0000-0000-0000-000000000000' WHERE "category_id" IS NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "category";