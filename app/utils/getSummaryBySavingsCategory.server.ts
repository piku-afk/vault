import { sql } from 'kysely';

import {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
} from './investmentQueries.server';
import { db } from './kysely.server';

export async function getSummaryBySavingsCategory() {
  return db
    .selectFrom('savings_categories as sc')
    .innerJoin('mutual_fund_schemes as mfs', 'sc.name', 'mfs.saving_category')
    .innerJoin('transactions as t', 't.scheme_name', 'mfs.scheme_name')
    .select([
      'sc.name',
      sql<number>`count(distinct ${sql.ref('mfs.scheme_name')})`.as('schemes_count'),
      netInvestedSql.as('invested'),
      netWorthSql.as('current'),
      netReturnsSql.as('returns'),
      netReturnsPercentageSql.as('returns_percentage'),
    ])
    .groupBy(['sc.name', 'sc.created_at'])
    .orderBy('sc.created_at')
    .execute();
}
