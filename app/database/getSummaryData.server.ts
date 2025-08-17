import { type CashFlow, xirr } from "@webcarrot/xirr";

import { db } from "../database/kysely.server";
import {
  netCurrentSql,
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
} from "./investmentQueries.server";

export async function getSummaryData() {
  const summary = await db
    .selectFrom("mutual_fund_summary as mfs")
    .select([
      netInvestedSql.as("net_invested"),
      netCurrentSql.as("net_current"),
      netReturnsSql.as("net_returns"),
      netReturnsPercentageSql.as("net_returns_percentage"),
    ])
    .executeTakeFirstOrThrow();

  return { ...summary, xirr: 0 };
}
