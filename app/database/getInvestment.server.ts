import { sql } from "kysely";

import { db } from "../database/kysely.server";
import {
  netCurrentSql,
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
} from "./investmentQueries.server";

export async function getInvestmentData() {
  return db
    .selectFrom("mutual_fund_schemes as mfs")
    .innerJoin("transactions as t", "t.scheme_name", "mfs.scheme_name")
    .select([
      "mfs.scheme_name",
      netCurrentSql.as("current"),
      netInvestedSql.as("invested"),
      netReturnsSql.as("returns"),
      netReturnsPercentageSql.as("returns_percentage"),
    ])
    .groupBy(["mfs.scheme_name", "mfs.nav"])
    .orderBy("mfs.scheme_name", "asc")
    .execute();
}

export async function getInvestmentDataBySavingsCategory() {
  return db
    .selectFrom("savings_categories as sc")
    .innerJoin("mutual_fund_schemes as mfs", "sc.name", "mfs.saving_category")
    .leftJoin(
      db
        .selectFrom("transactions as t")
        .innerJoin(
          "mutual_fund_schemes as mfs",
          "t.scheme_name",
          "mfs.scheme_name",
        )
        .select([
          netInvestedSql.as("invested"),
          netCurrentSql.as("current"),
          sql<string>`t.scheme_name`.as("scheme_name"),
        ])
        .groupBy("t.scheme_name")
        .as("agg"),
      "agg.scheme_name",
      "mfs.scheme_name",
    )
    .select([
      "sc.name",
      sql`
        json_agg(
          json_build_object(
            'name', mfs.scheme_name,
            'invested', agg.invested,
            'current', agg.current,
            'returns', (agg.current - agg.invested),
            'returns_percentage',
              CASE WHEN agg.invested <> 0
                THEN ROUND(((agg.current - agg.invested) / agg.invested) * 100, 2)
                ELSE 0
              END
          )
        )
      `.as("schemes"),
    ])
    .groupBy("sc.name")
    .orderBy("sc.name")
    .execute();
}
