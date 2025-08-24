import type { Kysely } from "kysely";
import { sql } from "kysely";

import {
  logViewCreation,
  logViewCreationError,
  setSecurityInvoker,
} from "#/utils/view-utils.server";

import type { KyselyDatabase } from "../kysely.server";

const STATS_SECTION_SUMMARY = "stats_section_summary";

export async function createStatsSectionSummary(db: Kysely<KyselyDatabase>) {
  try {
    logViewCreation(STATS_SECTION_SUMMARY);

    await db.schema
      .createView(STATS_SECTION_SUMMARY)
      .orReplace()
      .as(
        db
          .selectFrom("stats_section")
          .leftJoin("icons", "icons.name", "stats_section.icon_name")
          .selectAll("stats_section")
          .select((eb) => [
            "icons.src as icon",
            eb
              .case("title")
              .when("next_sip_date")
              .then(
                eb
                  .selectFrom("mutual_fund_schemes")
                  .select((eb) =>
                    eb
                      .fn<string>("concat", [
                        sql<number>`MIN(next_sip_date) - CURRENT_DATE`,
                        eb.val(" days"),
                      ])
                      .as("next_sip_days"),
                  )

                  .where("is_active", "=", true),
              )
              .when("sip_amount")
              .then(
                eb
                  .selectFrom("mutual_fund_schemes")
                  .select((eb) =>
                    eb
                      .cast(
                        eb.fn
                          .sum("sip_amount")
                          .filterWhere("is_active", "=", true),
                        "text",
                      )
                      .as("sip_amount"),
                  ),
              )
              .when("active_schemes")
              .then(
                eb
                  .selectFrom("mutual_fund_schemes")
                  .select((eb) =>
                    eb
                      .cast(eb.fn.count("scheme_name"), "text")
                      .as("scheme_count"),
                  )
                  .where("is_active", "=", true),
              )
              .end()
              .as("value"),
          ])
          .orderBy("display_order", "asc"),
      )
      .execute();

    await setSecurityInvoker(STATS_SECTION_SUMMARY, db);
  } catch (error) {
    logViewCreationError(STATS_SECTION_SUMMARY, error);
  }
}
