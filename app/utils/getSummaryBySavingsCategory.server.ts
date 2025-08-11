import { sql } from "kysely";

import {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
} from "./investmentQueries.server";
import { db } from "./kysely.server";

export async function getSummaryBySavingsCategory() {
  return db
    .selectFrom("mutual_fund_summary as mfs")
    .innerJoin("savings_categories as sc", "sc.name", "mfs.saving_category")
    .select([
      "sc.name",
      "sc.icon",
      sql<number>`count(distinct ${sql.ref("mfs.scheme_name")})`.as(
        "schemes_count",
      ),
      netInvestedSql.as("invested"),
      netWorthSql.as("current"),
      netReturnsSql.as("returns"),
      netReturnsPercentageSql.as("returns_percentage"),
    ])
    .groupBy(["sc.name", "sc.icon", "sc.created_at"])
    .orderBy("sc.created_at", "asc")
    .execute();
}
