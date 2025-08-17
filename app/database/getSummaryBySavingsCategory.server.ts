import { sql } from "kysely";

import { db } from "../database/kysely.server";
import {
  netCurrentSql,
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
} from "./investmentQueries.server";

export async function getSavingsCategorySummary() {
  return db
    .selectFrom("mutual_fund_summary as mfs")
    .innerJoin("savings_categories as sc", "sc.name", "mfs.saving_category")
    .innerJoin(
      "mutual_fund_schemes as mfs2",
      "mfs2.scheme_name",
      "mfs.scheme_name",
    )
    .select((eb) => [
      "sc.name",
      "sc.color",
      "sc.icon",
      eb
        .fn<string>("concat", [sql.lit("category/"), "sc.name"])
        .as("action_route"),
      eb
        .fn<string>("concat", [
          eb.fn.count("mfs.scheme_name"),
          sql.lit(" schemes"),
        ])
        .as("subtitle"),
      eb.fn.sum<number>("mfs2.sip_amount").as("monthly_sip"),
      netInvestedSql.as("invested"),
      netCurrentSql.as("current"),
      netReturnsSql.as("returns"),
      netReturnsPercentageSql.as("returns_percentage"),
    ])
    .groupBy(["sc.name", "sc.color", "sc.icon", "sc.created_at"])
    .orderBy("sc.created_at", "asc")
    .execute();
}
