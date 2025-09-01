ALTER TABLE "snippets" ADD COLUMN "tags" varchar(500);--> statement-breakpoint
CREATE INDEX "tags_idx" ON "snippets" USING btree ("tags");