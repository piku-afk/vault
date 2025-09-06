import { jsonArrayFrom } from "kysely/helpers/postgres";

import { db } from "./kysely.server";

export interface EmergencyPlanStep {
  id: string | null;
  title: string | null;
  icon: string | null;
  subtext: string | null;
  amount: number | null;
  is_approx_amount: boolean | null;
  color: string | null;
  children?: EmergencyPlanStep[];
}

export function getEmergencyPlan(): Promise<EmergencyPlanStep[]> {
  return db
    .selectFrom("emergency_plan_summary as eps")
    .leftJoin("icons as i", "i.name", "eps.icon")
    .selectAll("eps")
    .select((eb) => [
      "i.src as icon",
      jsonArrayFrom(
        eb
          .selectFrom("emergency_plan_summary as child")
          .leftJoin("icons as ci", "ci.name", "child.icon")
          .selectAll("child")
          .select(["ci.src as icon"])
          .whereRef("child.parent_level", "=", "eps.level")
          .orderBy("child.level"),
      ).as("children"),
    ])
    .where("eps.parent_level", "is", null)
    .orderBy("eps.level", "asc")
    .execute();
}
