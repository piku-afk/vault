import { type Kysely, sql } from "kysely";

import { logger } from "./logger.server";

export async function setSecurityInvoker<T>(viewName: string, db: Kysely<T>) {
  return sql`ALTER VIEW ${sql.raw(viewName)} SET (security_invoker = true)`.execute(
    db,
  );
}

export function logViewCreation(viewName: string) {
  logger.info(`Creating view: ${viewName}`);
}

export function logViewCreationError(viewName: string, error: unknown) {
  logger.error(`Error creating view: ${viewName}`);
  logger.error(error);
}
