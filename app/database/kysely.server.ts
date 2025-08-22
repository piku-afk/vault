import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import type { KyselifyDatabase } from "kysely-supabase";
import postgres from "postgres";

import type { Database as SupabaseDatabase } from "./database";

export type KyselyDatabase = KyselifyDatabase<SupabaseDatabase>;

export function createDatabaseInstance() {
  return new Kysely<KyselyDatabase>({
    dialect: new PostgresJSDialect({
      postgres: postgres(process.env.DATABASE_URL as string),
    }),
  });
}

export const db = createDatabaseInstance();
