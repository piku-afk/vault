import {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
} from './getSummaryData.server';
import { db } from './kysely.server';

export async function getInvestmentData() {
  return db
    .selectFrom('mutual_fund_schemes as mfs')
    .innerJoin('transactions as t', 't.scheme_name', 'mfs.scheme_name')
    .select([
      'mfs.scheme_name',
      netWorthSql.as('current'),
      netInvestedSql.as('invested'),
      netReturnsSql.as('returns'),
      netReturnsPercentageSql.as('returns_percentage'),
    ])
    .groupBy(['mfs.scheme_name', 'mfs.nav'])
    .orderBy('mfs.scheme_name', 'asc')
    .execute();
}
