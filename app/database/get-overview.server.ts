import { expressionBuilder, sql } from "kysely";

import { type Database, db } from "./kysely.server";

const mfsumEb = expressionBuilder<Database, "mutual_fund_summary">();
const net_current = mfsumEb.fn<string>("round", [
  mfsumEb.fn.sum("net_current"),
]);
const net_invested = mfsumEb.fn<string>("round", [
  mfsumEb.fn.sum("net_invested"),
]);
const returns = mfsumEb.fn<string>("round", [mfsumEb.fn.sum("returns")]);

export function getOverview(category?: string) {
  const summary = db
    .selectFrom("mutual_fund_summary")
    .select((eb) => [
      net_current.as("net_current"),
      net_invested.as("net_invested"),
      returns.as("net_returns"),
      eb
        .case()
        .when(net_invested, "=", "0")
        .then("0")
        .else(
          eb.fn<string>("round", [
            eb(eb(returns, "/", net_invested), "*", "100"),
            eb.lit<number>(2),
          ]),
        )
        .end()
        .as("net_returns_percentage"),

      // TODO: Replace with actual XIRR calculation when implemented. Currently set to "0" as a placeholder.
      sql
        .lit<string>("0")
        .as("xirr"),
    ])
    .$if(!!category, (eb) =>
      eb.where("saving_category", "=", category as string),
    )
    .executeTakeFirstOrThrow();

  const recentTransactions = db
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
    ])
    .$if(!category, (qb) => qb.select("mfs.saving_category as sub_text"))
    .$if(!!category, (qb) =>
      qb
        .select("mfs.sub_category as sub_text")
        .where("mfs.saving_category", "=", category as string),
    )
    .orderBy("t.date", "desc")
    .orderBy("t.updated_at", "desc")
    .limit(5)
    .execute();

  return { summary, recentTransactions };
}
