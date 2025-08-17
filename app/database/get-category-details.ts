import {
  netCurrentSql,
  netInvestedSql,
  netReturnsPercentageSql,
  netReturnsSql,
} from "./investmentQueries.server";
import { db } from "./kysely.server";

export async function getCategoryDetails(category: string) {
  const categoryDetails = db
    .selectFrom("savings_categories")
    .select(["name", "icon"])
    .where("name", "=", category)
    .executeTakeFirstOrThrow();

  const schemes = db
    .selectFrom("mutual_fund_summary as mfs")
    .innerJoin(
      "mutual_fund_schemes as mfs2",
      "mfs2.scheme_name",
      "mfs.scheme_name",
    )
    .select([
      "mfs2.scheme_name as name",
      "mfs2.logo as icon",
      "mfs2.sub_category as subtitle",
      "mfs2.sip_amount as monthly_sip",
      netInvestedSql.as("invested"),
      netCurrentSql.as("current"),
      netReturnsSql.as("returns"),
      netReturnsPercentageSql.as("returns_percentage"),
    ])
    .where("mfs2.saving_category", "=", category)
    .groupBy([
      "mfs2.scheme_name",
      "mfs2.logo",
      "mfs2.sub_category",
      "mfs2.sip_amount",
    ])
    .execute();

  return { categoryDetails, schemes };
}
