import {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
} from './investmentQueries.server';
import { db } from './kysely.server';

export async function getSummaryData() {
  return db
    .selectFrom('mutual_fund_summary as mfs')
    .select([
      netInvestedSql.as('net_invested'),
      netWorthSql.as('net_worth'),
      netReturnsSql.as('net_returns'),
      netReturnsPercentageSql.as('net_returns_percentage'),
    ])
    .executeTakeFirstOrThrow();
}
