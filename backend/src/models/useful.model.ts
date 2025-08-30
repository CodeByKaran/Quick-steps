import { integer, pgTable } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { snippetsTable } from "./snippets.model";

export const usefulTable = pgTable("usefuls", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  usefulBy: integer("user_id").references(() => usersTable.id),
  snippetId: integer("snippet_id").references(() => snippetsTable.id),
});
