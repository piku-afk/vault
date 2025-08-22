import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import type { KyselifyDatabase } from "kysely-supabase";
import postgres from "postgres";

import type { Database as SupabaseDatabase } from "./database";

export type KyselyDatabase = KyselifyDatabase<SupabaseDatabase>;

export const db = new Kysely<KyselyDatabase>({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.DATABASE_URL as string, {
      max: 15,
      idle_timeout: 30,
      max_lifetime: 1800,
      connect_timeout: 10,
    }),
  }),
});
