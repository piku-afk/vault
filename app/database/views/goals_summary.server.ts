import type { Kysely } from "kysely";

import {
  logViewCreation,
  logViewCreationError,
  setSecurityInvoker,
} from "#/utils/view-utils.server";

import type { KyselyDatabase } from "../kysely.server";
import { SAVINGS_CATEGORIES_SUMMARY_VIEW } from "./savings_categories_summary.server";

const GOALS_SUMMARY_VIEW = "goals_summary";

export async function createGoalsSummaryView(db: Kysely<KyselyDatabase>) {
  try {
    logViewCreation(GOALS_SUMMARY_VIEW);
    await db.schema
      .createView(GOALS_SUMMARY_VIEW)
      .orReplace()
      .as(
        db
          .with("goal_summary", (db) =>
            db
              .selectFrom("goals as g")
              .select((eb) => [
                "g.name",
                "g.target",
                "g.is_active",
                "g.icon",
                eb.fn
                  .coalesce(
                    eb
                      .selectFrom(`${SAVINGS_CATEGORIES_SUMMARY_VIEW} as scs`)
                      .select("scs.net_current")
                      .where("scs.category", "=", eb.ref("g.name")),
                    eb
                      .selectFrom(`${SAVINGS_CATEGORIES_SUMMARY_VIEW} as scs`)
                      .select("scs.net_current")
                      .where("scs.category", "is", null),
                  )
                  .as("current"),
                eb.fn
                  .coalesce(
                    eb
                      .selectFrom(`${SAVINGS_CATEGORIES_SUMMARY_VIEW} as scs`)
                      .select("scs.sip_amount")
                      .where("scs.category", "=", eb.ref("g.name")),
                    eb
                      .selectFrom(`${SAVINGS_CATEGORIES_SUMMARY_VIEW} as scs`)
                      .select("scs.sip_amount")
                      .where("scs.category", "is", null),
                  )
                  .as("sip_amount"),
              ]),
          )
          .selectFrom("goal_summary as g")
          .leftJoin("savings_categories as sc", "sc.name", "g.name")
          .leftJoin("icons as i", "i.name", "g.icon")
          .select((eb) => [
            "g.name",
            "g.target",
            "g.current",
            eb("g.target", "-", eb.ref("g.current")).as("remaining"),
            eb
              .case()
              .when("g.target", ">", eb.lit(0))
              .then(
                eb.fn("round", [
                  eb(
                    eb("g.current", "/", eb.ref("g.target")),
                    "*",
                    eb.lit(100),
                  ),
                  eb.lit(2),
                ]),
              )
              .else("0")
              .end()
              .as("progress"),
            "g.sip_amount",
            "sc.name as category",
            eb("g.current", ">=", eb.ref("g.target")).as("is_complete"),
            "i.src as icon",
          ]),
      )
      .execute();

    await setSecurityInvoker(GOALS_SUMMARY_VIEW, db);
  } catch (error) {
    logViewCreationError(GOALS_SUMMARY_VIEW, error);
  }
}
