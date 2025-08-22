import type { InferResult } from "kysely";

import { createDatabaseInstance } from "./kysely.server";

export async function getGoalsProgress() {
  const db = createDatabaseInstance();
  const query = db.selectFrom("goals_summary").selectAll();

  let goalsProgress: InferResult<typeof query>;

  try {
    goalsProgress = await query.execute();
  } finally {
    await db.destroy();
  }

  return goalsProgress;
}
