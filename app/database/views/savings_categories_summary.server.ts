import type { Kysely } from "kysely";

import {
  logViewCreation,
  logViewCreationError,
  setSecurityInvoker,
} from "#/utils/view-utils.server";

import type { KyselyDatabase } from "../kysely.server";
import { MUTUAL_FUND_SUMMARY_VIEW } from "./mutual_fund_schemes_summary.server";

export const SAVINGS_CATEGORIES_SUMMARY_VIEW = "savings_categories_summary";

export async function createSavingCategoriesSummaryView(
  db: Kysely<KyselyDatabase>,
) {
  try {
    logViewCreation(SAVINGS_CATEGORIES_SUMMARY_VIEW);
    await db.schema
      .createView(SAVINGS_CATEGORIES_SUMMARY_VIEW)
      .orReplace()
      .as(
        db
          .selectFrom(`${MUTUAL_FUND_SUMMARY_VIEW} as mfsum`)
          .leftJoin(
            "mutual_fund_schemes as mfs",
            "mfs.scheme_name",
            "mfsum.scheme_name",
          )
          .select((eb) => [
            "mfsum.saving_category as category",
            eb.fn.sum("mfsum.net_current").as("net_current"),
            eb.fn.sum("mfsum.net_invested").as("net_invested"),
            eb.fn.sum("mfsum.net_returns").as("net_returns"),
            eb
              .fn("round", [
                eb(
                  eb(
                    eb.fn.sum("mfsum.net_current"),
                    "/",
                    eb.fn.sum("mfsum.net_invested"),
                  ),
                  "*",
                  eb.lit(100),
                ),
                eb.lit(2),
              ])
              .as("net_current_percentage"),
            eb.fn
              .count("mfsum.scheme_name")
              .filterWhere("mfsum.net_units", ">", 0)
              .as("total_schemes"),
            eb.fn
              .coalesce(
                eb.fn
                  .sum("mfs.sip_amount")
                  .filterWhere("mfs.is_active", "=", true),
                eb.lit(0),
              )
              .as("sip_amount"),
            eb.fn.min("mfs.next_sip_date").as("next_sip_date"),
          ])
          .groupBy((eb) => eb.fn("rollup", ["mfsum.saving_category"])),
      )
      .execute();

    await setSecurityInvoker(SAVINGS_CATEGORIES_SUMMARY_VIEW, db);
  } catch (error) {
    logViewCreationError(SAVINGS_CATEGORIES_SUMMARY_VIEW, error);
  }
}
