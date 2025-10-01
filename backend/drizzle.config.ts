import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/models",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_7SjABGpU2bnZ@ep-withered-moon-a12celbr-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});
