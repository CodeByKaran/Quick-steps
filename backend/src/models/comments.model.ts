import { integer, pgTable } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { snippetsTable } from "./snippets.model";

//todo change to comments model type schema

export const popularTable = pgTable("populars", {
  id: integer()
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  hypedBy: integer("user_id").references(() => usersTable.id),
  snippetId: integer("snippet_id").references(() => snippetsTable.id),
});
