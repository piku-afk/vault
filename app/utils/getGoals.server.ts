import { sql } from 'kysely';

import { netWorthSql } from './investmentQueries.server';
import { db } from './kysely.server';

export async function getGoalProgress() {
  return db
    .selectFrom('goal as g')
    .innerJoin('savings_categories as sc', 'sc.name', 'g.name')
    .innerJoin('mutual_fund_summary as mfs', 'mfs.saving_category', 'g.name')
    .select([
      'g.name',
      'g.target',
      'sc.icon',
      netWorthSql.as('current'),
      sql<number>`
        CASE
          WHEN ${netWorthSql} >= g.target 
          THEN 0
          ELSE g.target - ${netWorthSql}
        END
      `.as('remaining'),
      sql<number>`
        CASE
          WHEN ${netWorthSql} >= g.target 
          THEN 100
          ELSE ROUND((${netWorthSql} / g.target) * 100, 2)
        END
      `.as('progress'),
      sql<boolean>`
        CASE
          WHEN ${netWorthSql} >= g.target 
          THEN true
          ELSE false
        END
      `.as('is_complete'),
    ])
    .groupBy(['g.name', 'g.target', 'sc.icon'])
    .execute();
}
