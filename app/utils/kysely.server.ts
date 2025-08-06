import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import type { KyselifyDatabase } from 'kysely-supabase';
import postgres from 'postgres';
import type { Database as SupabaseDatabase } from '#/types/database.ts';

export type Database = KyselifyDatabase<SupabaseDatabase>;

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.DATABASE_URL as string),
  }),
});
