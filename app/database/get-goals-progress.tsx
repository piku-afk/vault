import type { InferResult } from "kysely";

import { db } from "./kysely.server";

export async function getGoalsProgress() {
  const query = db.selectFrom("goals_summary").selectAll();

  let goalsProgress: InferResult<typeof query>;

  try {
    goalsProgress = await query.execute();
  } finally {
    await db.destroy();
  }

  return goalsProgress;
}
