import {
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
  netWorthSql,
} from "./investmentQueries.server";
import { db } from "./kysely.server";

export async function getCategoryDetails(category: string) {
  const categoryDetails = await db
    .selectFrom("savings_categories")
    .select(["name", "icon"])
    .where("name", "=", category)
    .executeTakeFirstOrThrow();

  const schemes = await db
    .selectFrom("mutual_fund_summary as mfs")
    .innerJoin(
      "mutual_fund_schemes as mfs2",
      "mfs2.scheme_name",
      "mfs.scheme_name",
    )
    .select([
      "mfs.scheme_name",
      "mfs2.logo",
      "mfs2.sub_category",
      "mfs2.sip_amount",
      netInvestedSql.as("invested"),
      netWorthSql.as("current"),
      netReturnsSql.as("returns"),
      netReturnsPercentageSql.as("returns_percentage"),
    ])
    .where("mfs.saving_category", "=", category)
    .groupBy([
      "mfs.scheme_name",
      "mfs2.logo",
      "mfs2.sub_category",
      "mfs2.sip_amount",
    ])
    .execute();

  return { categoryDetails, schemes };
}
