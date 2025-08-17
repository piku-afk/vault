import { type CashFlow, xirr } from "@webcarrot/xirr";

import { db } from "../database/kysely.server";
import {
  netCurrentSql,
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
} from "./investmentQueries.server";

export async function getSummaryData() {
  return await db
    .selectFrom("mutual_fund_summary as mfs")
    .select((eb) => [
      netInvestedSql.as("net_invested"),
      netCurrentSql.as("net_current"),
      netReturnsSql.as("net_returns"),
      netReturnsPercentageSql.as("net_returns_percentage"),
      eb.lit<number>(0).as("xirr"),
    ])
    .executeTakeFirstOrThrow();
}
