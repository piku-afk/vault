import {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
} from './investmentQueries.server';
import { db } from './kysely.server';

// Re-export for backward compatibility
export {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
  TRANSACTION_TYPE,
} from './investmentQueries.server';

export async function getSummaryData() {
  return db
    .selectFrom('transactions as t')
    .innerJoin('mutual_fund_schemes as mfs', 'mfs.scheme_name', 't.scheme_name')
    .select([
      netInvestedSql.as('net_invested'),
      netWorthSql.as('net_worth'),
      netReturnsSql.as('net_returns'),
      netReturnsPercentageSql.as('net_returns_percentage'),
    ])
    .executeTakeFirstOrThrow();
}
