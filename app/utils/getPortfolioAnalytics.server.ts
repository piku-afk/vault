import { sql } from "kysely";

import { netWorthSql } from "./investmentQueries.server";
import { db } from "./kysely.server";

export async function getCategoryAllocation() {
  const categoryAllocation = await db
    .selectFrom(
      db
        .selectFrom("mutual_fund_summary as mfs")
        .innerJoin("savings_categories as sc", "sc.name", "mfs.saving_category")
        .select(["sc.name", "sc.color", netWorthSql.as("current")])
        .groupBy(["sc.name", "sc.color", "sc.created_at"])
        .orderBy("sc.created_at", "asc")
        .as("summary_by_category"),
    )
    .select([
      "name",
      "color",
      sql<number>`round((current / sum(current) over ()) * 100,2)`.as(
        "allocation_percentage",
      ),
    ])
    .execute();

  return categoryAllocation;
}

export async function getBestPerformer() {
  const performers = await db
    .selectFrom("transactions")
    .innerJoin(
      "mutual_fund_schemes",
      "transactions.scheme_name",
      "mutual_fund_schemes.scheme_name",
    )
    .select([
      "mutual_fund_schemes.saving_category as category",
      sql<number>`
        SUM(
          CASE 
            WHEN transactions.transaction_type = 'Purchase' THEN transactions.amount
            WHEN transactions.transaction_type = 'Redemption' THEN -transactions.amount
            ELSE 0
          END
        )
      `.as("invested"),
      sql<number>`
        SUM(
          CASE 
            WHEN transactions.transaction_type = 'Purchase' THEN transactions.units * mutual_fund_schemes.nav
            WHEN transactions.transaction_type = 'Redemption' THEN -transactions.units * mutual_fund_schemes.nav
            ELSE 0
          END
        )
      `.as("current_value"),
    ])
    .groupBy("mutual_fund_schemes.saving_category")
    .having(
      sql`SUM(
      CASE 
        WHEN transactions.transaction_type = 'Purchase' THEN transactions.units
        WHEN transactions.transaction_type = 'Redemption' THEN -transactions.units
        ELSE 0
      END
    )`,
      ">",
      0,
    )
    .execute();

  // Calculate returns and find best performer
  const performersWithReturns = performers.map((performer) => ({
    ...performer,
    returns: performer.current_value - performer.invested,
    returnsPercentage:
      performer.invested > 0
        ? ((performer.current_value - performer.invested) /
            performer.invested) *
          100
        : 0,
  }));

  return (
    performersWithReturns.sort(
      (a, b) => b.returnsPercentage - a.returnsPercentage,
    )[0] || null
  );
}
