import {
  integer,
  pgTable,
  varchar,
  index,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.ts";
import { snippetsTable } from "./snippets.model.ts";

//todo change to comments model type schema

export const commentsTable = pgTable(
  "comments",
  {
    id: integer()
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    commentedBy: integer("user_id").references(() => usersTable.id),
    snippetId: integer("snippet_id").references(() => snippetsTable.id),
    comment: varchar({ length: 300 }).notNull(),
    createdAt: timestamp({ precision: 6, withTimezone: true }).defaultNow(),
    updatedAt: timestamp({ precision: 6, withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("commented_by_idx").on(table.commentedBy),
    index("snippet_id_idx").on(table.snippetId),
  ]
);

export type commentInsertionType = typeof commentsTable.$inferInsert;
