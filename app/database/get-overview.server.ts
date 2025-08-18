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
        .then(0)
        .else(
          eb.fn("round", [
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
    .$if(Boolean(category), (eb) =>
      eb.where("saving_category", "=", category as string),
    )
    .executeTakeFirstOrThrow();

  return { summary };
}
