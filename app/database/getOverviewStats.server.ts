import { db } from "../database/kysely.server";

export async function getRecentTransactions(category?: string) {
  return db
    .selectFrom("transactions as t")
    .innerJoin("mutual_fund_schemes as mfs", "t.scheme_name", "mfs.scheme_name")
    .select([
      "t.id",
      "t.date",
      "t.amount",
      "t.transaction_type",
      "t.scheme_name as name",
      "t.units",
      "t.nav",
      "mfs.logo as icon",
      "mfs.saving_category as sub_text",
    ])
    .$if(!!category, (qb) =>
      qb.where("mfs.saving_category", "=", category as string),
    )
    .orderBy("t.date", "desc")
    .orderBy("t.updated_at", "desc")
    .limit(5)
    .execute();
}

export async function getQuickStats() {
  return db
    .selectFrom("mutual_fund_schemes")
    .select((eb) => [
      eb.fn
        .count<string>("scheme_name")
        .filterWhere("is_active", "=", true)
        .as("total_schemes"),
      eb.fn
        .sum<string>("sip_amount")
        .filterWhere("is_active", "=", true)
        .as("monthly_sip"),
      eb.fn.min<string>("next_sip_date").as("next_sip_date"),
    ])
    .executeTakeFirstOrThrow();
}
