import type { Kysely } from "kysely";

import {
  logViewCreation,
  logViewCreationError,
  setSecurityInvoker,
} from "#/utils/view-utils.server";

import type { KyselyDatabase } from "../kysely.server";

const EMERGENCY_PLAN_SUMMARY_VIEW = "emergency_plan_summary";

export async function createEmergencyPlanSummaryView(
  db: Kysely<KyselyDatabase>,
) {
  try {
    logViewCreation(EMERGENCY_PLAN_SUMMARY_VIEW);

    await db.schema
      .createView(EMERGENCY_PLAN_SUMMARY_VIEW)
      .orReplace()
      .as(
        db
          .selectFrom("emergency_plan")
          .selectAll()
          .select((eb) =>
            eb
              .case()
              .when(
                // level 1
                eb.and([eb("parent_level", "is", null), eb("level", "=", 1)]),
              )
              .then(30_000)
              .when(
                // level 2
                eb.and([eb("parent_level", "is", null), eb("level", "=", 2)]),
              )
              .then(
                eb
                  .selectFrom("credit_cards")
                  .select((eb) =>
                    eb.fn.sum("credit_limit").as("credit_limit_sum"),
                  ),
              )
              .when(
                // level 4
                eb.and([eb("parent_level", "is", null), eb("level", "=", 4)]),
              )
              .then(
                eb
                  .selectFrom("mutual_fund_schemes_summary")
                  .select((eb) =>
                    eb.fn.sum("net_current").as("net_current_sum"),
                  )
                  .where("saving_category", "=", "Long Term"), // <-- hard coded value
              )
              .when(
                // level 3.1
                eb.and([eb("parent_level", "=", 3), eb("level", "=", 1)]),
              )
              .then(30_000)
              .when(
                // level 3.2
                eb.and([eb("parent_level", "=", 3), eb("level", "=", 2)]),
              )
              .then(
                eb
                  .selectFrom("mutual_fund_schemes_summary")

                  .select((eb) =>
                    eb.fn.sum("net_current").as("net_current_sum"),
                  )
                  .where((eb) =>
                    eb.and([
                      eb("saving_category", "=", "Emergency"), // <-- hard coded value
                      eb("sub_category", "=", "Liquid"), // <-- hard coded value
                    ]),
                  ),
              )
              .when(
                // level 3.3
                eb.and([eb("parent_level", "=", 3), eb("level", "=", 3)]),
              )
              .then(
                eb
                  .selectFrom("mutual_fund_schemes_summary")
                  .select((eb) =>
                    eb.fn.sum("net_current").as("net_current_sum"),
                  )
                  .where((eb) =>
                    eb.and([
                      eb("saving_category", "=", "Emergency"), // <-- hard coded value
                      eb("sub_category", "=", "Money Market"), // <-- hard coded value
                    ]),
                  ),
              )
              .when(
                // level 3.4
                eb.and([eb("parent_level", "=", 3), eb("level", "=", 4)]),
              )
              .then(
                eb
                  .selectFrom("mutual_fund_schemes_summary")
                  .select((eb) =>
                    eb.fn.sum("net_current").as("net_current_sum"),
                  )
                  .where((eb) =>
                    eb.and([
                      eb("saving_category", "=", "Emergency"), // <-- hard coded value
                      eb("sub_category", "=", "Arbitrage"), // <-- hard coded value
                    ]),
                  ),
              )
              .end()
              .as("amount"),
          ),
      )
      .execute();

    await setSecurityInvoker(EMERGENCY_PLAN_SUMMARY_VIEW, db);
  } catch (error) {
    logViewCreationError(EMERGENCY_PLAN_SUMMARY_VIEW, error);
  }
}
