import { sql } from 'kysely';

import { TRANSACTION_TYPE } from '#/constants/transaction_type';

// Base SQL fragments for investment calculations
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
      WHEN t.transaction_type = ${sql.lit(TRANSACTION_TYPE.PURCHASE)} THEN t.units * mfs.nav
      WHEN t.transaction_type = ${sql.lit(TRANSACTION_TYPE.REDEEM)} THEN -t.units * mfs.nav
      ELSE 0 
    END
  )
`;

export const netReturnsSql = sql<number>`${netWorthSql} - ${netInvestedSql}`;

export const netReturnsPercentageSql = sql<number>`
  CASE 
    WHEN ${netInvestedSql} = 0 THEN 0
    ELSE ROUND(((${netReturnsSql}) / (${netInvestedSql})) * 100, 2)
  END
`;

// Helper function to create investment summary object in SQL
export const createInvestmentSummaryJson = (nameField: string) => sql`
  json_build_object(
    'name', ${sql.ref(nameField)},
    'invested', ${netInvestedSql},
    'current', ${netWorthSql},
    'returns', ${netReturnsSql},
    'returns_percentage', ${netReturnsPercentageSql}
  )
`;
