import { db } from "../database/kysely.server";
import {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
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
      "sc.icon",
      eb.fn.count("mfs.scheme_name").as("schemes_count"),
      eb.fn.sum("mfs2.sip_amount").as("monthly_sip"),
      netInvestedSql.as("invested"),
      netWorthSql.as("current"),
      netReturnsSql.as("returns"),
      netReturnsPercentageSql.as("returns_percentage"),
    ])
    .groupBy(["sc.name", "sc.icon", "sc.created_at"])
    .orderBy("sc.created_at", "asc")
    .execute();
}
