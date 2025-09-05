import { jsonArrayFrom } from "kysely/helpers/postgres";

import { db } from "./kysely.server";

export interface EmergencyPlanStep {
  id: string;
  title: string;
  icon: string | null;
  subtext: string | null;
  amount: number | null;
  is_approx_amount: boolean;
  color: string | null;
  children?: EmergencyPlanStep[];
}

export function getEmergencyPlan(): Promise<EmergencyPlanStep[]> {
  return db
    .selectFrom("emergency_plan as ep")
    .leftJoin("icons as i", "i.name", "ep.icon")
    .selectAll("ep")
    .select((eb) => [
      "i.src as icon",
      jsonArrayFrom(
        eb
          .selectFrom("emergency_plan as child")
          .leftJoin("icons as ci", "ci.name", "child.icon")
          .selectAll("child")
          .select(["ci.src as icon"])
          .whereRef("child.parent_level", "=", "ep.level")
          .orderBy("child.level"),
      ).as("children"),
    ])
    .where("ep.parent_level", "is", null)
    .orderBy("ep.level")
    .execute();
}
