import { db } from "./kysely.server";

export async function getGoalsProgress() {
  return await db.selectFrom("goals_summary").selectAll().execute();
}
