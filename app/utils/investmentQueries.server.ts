import { sql } from 'kysely';

// Base SQL fragments for investment calculations
export const netInvestedSql = sql<number>`round(sum(mfs.net_invested))`;
export const netWorthSql = sql<number>`round(sum(mfs.net_current))`;
export const netReturnsSql = sql<number>`round(sum(mfs.returns))`;
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
