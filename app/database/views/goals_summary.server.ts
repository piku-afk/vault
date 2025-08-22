import type { Kysely } from "kysely";

import {
  dropViewIfExists,
  logViewCreation,
  logViewCreationError,
  setSecurityInvoker,
} from "#/utils/view-utils.server";

import type { KyselyDatabase } from "../kysely.server";

const VIEW_NAME = "goals_summary";

export async function createGoalsSummaryView(db: Kysely<KyselyDatabase>) {
  try {
    await dropViewIfExists(VIEW_NAME, db);

    logViewCreation(VIEW_NAME);
    await db.schema
      .createView(VIEW_NAME)
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
                      .selectFrom("savings_category_summary as scs")
                      .select("scs.net_current")
                      .where("scs.category", "=", eb.ref("g.name")),
                    eb
                      .selectFrom("savings_category_summary as scs")
                      .select("scs.net_current")
                      .where("scs.category", "is", null),
                  )
                  .as("current"),
                eb.fn
                  .coalesce(
                    eb
                      .selectFrom("savings_category_summary as scs")
                      .select("scs.sip_amount")
                      .where("scs.category", "=", eb.ref("g.name")),
                    eb
                      .selectFrom("savings_category_summary as scs")
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
            "sc.name as category",
            eb("g.current", ">=", eb.ref("g.target")).as("is_complete"),
            "i.src as icon",
          ]),
      )
      .execute();

    await setSecurityInvoker(VIEW_NAME, db);
  } catch (error) {
    logViewCreationError(VIEW_NAME, error);
  }
}
