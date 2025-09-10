ALTER TABLE "comments" ADD COLUMN "createdAt" timestamp (6) with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "updatedAt" timestamp (6) with time zone DEFAULT now();--> statement-breakpoint
CREATE INDEX "commented_by_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "snippet_id_idx" ON "comments" USING btree ("snippet_id");