import { drizzle } from "drizzle-orm/neon-web";

import { neon, neonConfig } from '@neondatabase/serverless';
import { config } from "dotenv";
import * as schema from "./schema"; 
neonConfig.fetchConnectionCache = true;
config({ path: ".env.local" }); // or .env.local


const sql = neon('postgresql://neondb_owner:npg_VmINzGdZ1E2f@ep-broad-paper-a51sv5bh-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require');
export const db = drizzle({ client: sql, schema });
