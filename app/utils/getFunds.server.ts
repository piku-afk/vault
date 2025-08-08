import { sql } from 'kysely';

import {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
} from './getSummaryData.server';
import { db } from './kysely.server';

export async function getFundsData() {
  // return fund_name, returns, current, invested
  return db
    .selectFrom('mutual_fund as mf')
    .innerJoin('transaction as t', 't.fund_name', 'mf.fund_name')
    .select([
      'mf.fund_name',
      netWorthSql.as('current'),
      netInvestedSql.as('invested'),
      netReturnsSql.as('returns'),
      netReturnsPercentageSql.as('returns_percentage'),
    ])
    .groupBy(['mf.fund_name', 'mf.current_nav'])
    .orderBy('mf.fund_name', 'asc')
    .execute();
}
