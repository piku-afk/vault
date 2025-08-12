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

export async function getBestAndWorstPerformer() {
  await new Promise((resolve) => setTimeout(resolve, 4_000));

  const baseQuery = db
    .selectFrom("mutual_fund_summary")
    .select(["scheme_name", "saving_category", "nav_diff_percentage"]);

  const [bestPerformer, worstPerformer] = await Promise.all([
    baseQuery.orderBy("nav_diff_percentage", "desc").executeTakeFirstOrThrow(),
    baseQuery.orderBy("nav_diff_percentage", "asc").executeTakeFirstOrThrow(),
  ]);

  return { bestPerformer, worstPerformer };
}
