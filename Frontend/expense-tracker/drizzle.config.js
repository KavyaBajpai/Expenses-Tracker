import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env.local' });

export default defineConfig({
  schema: "./utils/schema.jsx",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_VmINzGdZ1E2f@ep-broad-paper-a51sv5bh-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
  mode: "default",
} );
