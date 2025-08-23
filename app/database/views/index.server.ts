import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

import { logger } from "#/utils/logger.server";

import type { KyselyDatabase } from "../kysely.server";
import { createGoalsSummaryView } from "./goals_summary.server";
import { createMutualFundSummaryView } from "./mutual_fund_schemes_summary.server";
import { createSavingCategoriesSummaryView } from "./savings_categories_summary.server";

logger.info("create database instance");
const db = new Kysely<KyselyDatabase>({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.DATABASE_URL as string, {
      max: 1,
    }),
  }),
});

const start = Date.now();
try {
  await createMutualFundSummaryView(db);
  await createSavingCategoriesSummaryView(db);
  await createGoalsSummaryView(db);
} catch (error) {
  logger.error(error);
} finally {
  await db.destroy();
  logger.info("destroy database instance");
  const end = Date.now();
  logger.info(`completed in: ${end - start}ms`);
}
