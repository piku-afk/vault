import { Divider, Stack } from "@mantine/core";
import { sql } from "kysely";

import { db } from "#/utils/kysely.server.ts";
import { Goals } from "./goals/goals";
import { Overview } from "./overview/overview";

const netInvestedSql = sql<number>`
  SUM(
    CASE 
      WHEN t.transaction_type = 'PURCHASE' THEN t.amount 
      WHEN t.transaction_type = 'WITHDRAWAL' THEN -t.amount 
      ELSE 0 
    END
  )
`;

const netWorthSql = sql<number>`
  SUM(
    CASE 
      WHEN t.transaction_type = 'PURCHASE' THEN t.units * mf.current_nav
      WHEN t.transaction_type = 'WITHDRAWAL' THEN -t.units * mf.current_nav
      ELSE 0 
    END
  )
`;

const netReturnsSql = sql<number>`${netWorthSql} - ${netInvestedSql}`;

export async function loader() {
  const data = await db
    .selectFrom("transaction as t")
    .innerJoin("mutual_fund as mf", "mf.fund_name", "t.fund_name")
    .select([
      netInvestedSql.as("net_invested"),
      netWorthSql.as("net_worth"),
      netReturnsSql.as("net_returns"),
    ])
    .executeTakeFirstOrThrow();

  return data;
}

export default function Investments() {
  return (
    <Stack gap="xl">
      <Overview />
      <Divider />
      <Goals />
    </Stack>
  );
}
