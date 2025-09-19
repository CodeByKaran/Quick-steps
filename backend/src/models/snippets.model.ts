import {
  integer,
  pgTable,
  varchar,
  index,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";

export const snippetsTable = pgTable(
  "snippets",
  {
    id: integer()
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    title: varchar({ length: 255 }).notNull().unique(),
    markdown: varchar({ length: 5000 }).notNull(),
    description: varchar({ length: 1000 }),
    tags: varchar({ length: 500 }),
    userId: integer("user_id").references(() => usersTable.id),
    createdAt: timestamp({ precision: 6, withTimezone: true }).defaultNow(),
    updatedAt: timestamp({ precision: 6, withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("title_idx").on(table.title),
    index("user_id_idx").on(table.userId),
    index("tags_idx").on(table.tags),
  ]
);
