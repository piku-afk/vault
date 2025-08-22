import { db } from "./kysely.server";

export async function getGoalsProgress() {
  return db.selectFrom("goals_summary").selectAll().execute();
}
