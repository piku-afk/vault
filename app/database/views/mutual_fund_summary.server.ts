import type { Kysely } from "kysely";

import {
  logViewCreation,
  logViewCreationError,
  setSecurityInvoker,
} from "#/utils/view-utils.server";

import type { KyselyDatabase } from "../kysely.server";

export const MUTUAL_FUND_SUMMARY_VIEW = "mutual_fund_schemes_summary";

export async function createMutualFundSummaryView(db: Kysely<KyselyDatabase>) {
  try {
    logViewCreation(MUTUAL_FUND_SUMMARY_VIEW);

    await db.schema
      .createView(MUTUAL_FUND_SUMMARY_VIEW)
      .orReplace()
      .as(
        db
          .with("unit_aggregates", (db) =>
            db
              .selectFrom("mutual_fund_schemes as mfs")
              .leftJoin("transactions as t", "t.scheme_name", "mfs.scheme_name")
              .select((eb) => [
                "mfs.scheme_name",
                eb.fn
                  .coalesce(eb.fn.sum("t.amount"), eb.lit(0))
                  .as("net_invested"),
                eb.fn
                  .coalesce(
                    eb.fn
                      .sum("t.units")
                      .filterWhere("t.transaction_type", "=", "purchase"),
                    eb.lit(0),
                  )
                  .as("units_purchased"),
                eb.fn
                  .coalesce(
                    eb.fn
                      .sum("t.units")
                      .filterWhere("t.transaction_type", "=", "redeem"),
                    eb.lit(0),
                  )
                  .as("units_sold"),
              ])
              .groupBy("mfs.scheme_name"),
          )
          .with("net_units", (db) =>
            db
              .selectFrom("unit_aggregates as ua")
              .leftJoin(
                "mutual_fund_schemes as mfs",
                "mfs.scheme_name",
                "ua.scheme_name",
              )
              .select((eb) => [
                "ua.scheme_name",
                "ua.net_invested",
                eb("ua.units_purchased", "-", eb.ref("ua.units_sold")).as(
                  "net_units",
                ),
                eb
                  .fn("round", [
                    eb(
                      eb.parens(
                        "ua.units_purchased",
                        "-",
                        eb.ref("ua.units_sold"),
                      ),
                      "*",
                      eb.ref("mfs.nav"),
                    ),
                    eb.lit(2),
                  ])
                  .as("net_current"),
              ]),
          )
          .selectFrom("mutual_fund_schemes as mfs")
          .leftJoin("net_units as nu", "nu.scheme_name", "mfs.scheme_name")
          .select((eb) => [
            "nu.scheme_name",
            "mfs.saving_category",
            "nu.net_units",
            "nu.net_current",
            "nu.net_invested",
            eb("nu.net_current", "-", eb.ref("nu.net_invested")).as(
              "net_returns",
            ),
            eb
              .case()
              .when(eb.ref("nu.net_invested"), ">", 0)
              .then(
                eb.fn("round", [
                  eb(
                    eb.parens(
                      eb.parens(
                        "nu.net_current",
                        "-",
                        eb.ref("nu.net_invested"),
                      ),
                      "/",
                      eb.ref("nu.net_invested"),
                    ),
                    "*",
                    eb.lit(100),
                  ),
                  eb.lit(2),
                ]),
              )
              .else(0)
              .end()
              .as("net_returns_percentage"),
            eb
              .case()
              .when(eb.ref("mfs.last_month_nav"), "!=", 0)
              .then(
                eb.fn("round", [
                  eb(
                    eb.parens(
                      eb.parens("mfs.nav", "-", eb.ref("mfs.last_month_nav")),
                      "/",
                      eb.ref("mfs.last_month_nav"),
                    ),
                    "*",
                    eb.lit(100),
                  ),
                  eb.lit(2),
                ]),
              )
              .else(0)
              .end()
              .as("nav_diff_percentage"),
          ])
          .orderBy("mfs.scheme_name"),
      )
      .execute();
    await setSecurityInvoker(MUTUAL_FUND_SUMMARY_VIEW, db);
  } catch (error) {
    logViewCreationError(MUTUAL_FUND_SUMMARY_VIEW, error);
  }
}
