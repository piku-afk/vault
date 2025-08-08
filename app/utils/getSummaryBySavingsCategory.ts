import { sql } from 'kysely';

import { db } from './kysely.server';

export async function getSummaryBySavingsCategory() {
  return db
    .selectFrom('savings_categories as sc')
    .innerJoin('mutual_fund_schemes as mfs', 'sc.name', 'mfs.saving_category')
    .innerJoin('transactions as t', 't.scheme_name', 'mfs.scheme_name')
    .select([
      'sc.name',
      sql<number>`SUM(
      CASE 
        WHEN t.transaction_type = 'Purchase' THEN t.amount
        WHEN t.transaction_type = 'Redeem' THEN -t.amount
        ELSE 0
      END
    )`.as('invested'),
      sql<number>`SUM(
      CASE 
        WHEN t.transaction_type = 'Purchase' THEN t.units * mfs.nav
        WHEN t.transaction_type = 'Redeem' THEN -t.units * mfs.nav
        ELSE 0
      END
    )`.as('current'),
      sql<number>`(SUM(
      CASE 
        WHEN t.transaction_type = 'Purchase' THEN t.units * mfs.nav
        WHEN t.transaction_type = 'Redeem' THEN -t.units * mfs.nav
        ELSE 0
      END
    )) - SUM(
      CASE 
        WHEN t.transaction_type = 'Purchase' THEN t.amount
        WHEN t.transaction_type = 'Redeem' THEN -t.amount
        ELSE 0
      END
    )`.as('returns'),
      sql<number>`CASE 
      WHEN SUM(
        CASE 
          WHEN t.transaction_type = 'Purchase' THEN t.amount
          WHEN t.transaction_type = 'Redeem' THEN -t.amount
          ELSE 0
        END
      ) <> 0
      THEN ROUND(
        (
          (SUM(
            CASE 
              WHEN t.transaction_type = 'Purchase' THEN t.units  * mfs.nav
              WHEN t.transaction_type = 'Redeem' THEN -t.units * mfs.nav
              ELSE 0
            END
          )) -
          SUM(
            CASE 
              WHEN t.transaction_type = 'Purchase' THEN t.amount
              WHEN t.transaction_type = 'Redeem' THEN -t.amount
              ELSE 0
            END
          )
        ) / SUM(
          CASE 
            WHEN t.transaction_type = 'Purchase' THEN t.amount
            WHEN t.transaction_type = 'Redeem' THEN -t.amount
            ELSE 0
          END
        ) * 100, 2
      )
      ELSE 0
    END`.as('returns_percentage'),
    ])
    .groupBy('sc.name')
    .orderBy('sc.name')
    .execute();
}
