import { integer, pgTable, varchar, index } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.ts";

export const snippetsTable = pgTable(
  "snippets",
  {
    id: integer()
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    title: varchar({ length: 255 }).notNull().unique(),
    markdown: varchar({ length: 5000 }).notNull(),
    description: varchar({ length: 1000 }),
    userId: integer("user_id").references(() => usersTable.id),
  },
  (table) => [
    index("title_idx").on(table.title),
    index("user_id_idx").on(table.userId),
  ]
);
