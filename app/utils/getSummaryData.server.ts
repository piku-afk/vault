import { sql } from 'kysely';

import { db } from './kysely.server';

export enum TRANSACTION_TYPE {
  PURCHASE = 'Purchase',
  REDEEM = 'Redeem',
}

export const netInvestedSql = sql<number>`
  SUM(
    CASE 
      WHEN t.transaction_type = ${sql.lit(TRANSACTION_TYPE.PURCHASE)} THEN t.amount 
      WHEN t.transaction_type = ${sql.lit(TRANSACTION_TYPE.REDEEM)} THEN -t.amount 
      ELSE 0 
    END
  )
`;

export const netWorthSql = sql<number>`
  SUM(
    CASE 
      WHEN t.transaction_type = ${sql.lit(TRANSACTION_TYPE.PURCHASE)} THEN t.units * mf.current_nav
      WHEN t.transaction_type = ${sql.lit(TRANSACTION_TYPE.REDEEM)} THEN -t.units * mf.current_nav
      ELSE 0 
    END
  )
`;

export const netReturnsSql = sql<number>`${netWorthSql} - ${netInvestedSql}`;
export const netReturnsPercentageSql = sql<number>`
  CASE 
    WHEN ${netInvestedSql} = 0 THEN 0
    ELSE ((${netReturnsSql}) / (${netInvestedSql})) * 100
  END
`;

export async function getSummaryData() {
  return db
    .selectFrom('transaction as t')
    .innerJoin('mutual_fund as mf', 'mf.fund_name', 't.fund_name')
    .select([
      netInvestedSql.as('net_invested'),
      netWorthSql.as('net_worth'),
      netReturnsSql.as('net_returns'),
      netReturnsPercentageSql.as('net_returns_percentage'),
    ])
    .executeTakeFirstOrThrow();
}
