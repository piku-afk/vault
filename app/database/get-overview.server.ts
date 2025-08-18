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
const returns_percentage = mfsumEb
  .case()
  .when(net_invested, "=", "0")
  .then("0")
  .else(
    mfsumEb.fn<string>("round", [
      mfsumEb(mfsumEb(returns, "/", net_invested), "*", "100"),
      mfsumEb.lit<number>(2),
    ]),
  )
  .end();

export function getOverview(category?: string) {
  const summary = db
    .selectFrom("mutual_fund_summary")
    .select([
      net_current.as("net_current"),
      net_invested.as("net_invested"),
      returns.as("net_returns"),
      returns_percentage.as("net_returns_percentage"),
      // TODO: Replace with actual XIRR calculation when implemented. Currently set to "0" as a placeholder.
      sql
        .lit<string>("0")
        .as("xirr"),
    ])
    .$if(!!category, (eb) =>
      eb.where("saving_category", "=", category as string),
    )
    .executeTakeFirstOrThrow();

  const stats = db
    .selectFrom("mutual_fund_summary as mfsum")
    .innerJoin(
      "mutual_fund_schemes as mfs",
      "mfs.scheme_name",
      "mfsum.scheme_name",
    )
    .select((eb) => [
      eb.fn
        .count<string>("mfsum.scheme_name")
        // TODO: add net_units in mfsum and use net_units  > 0
        .filterWhere("mfsum.net_invested", ">", 0)
        .as("total_schemes"),
      eb.fn
        .sum<string>("mfs.sip_amount")
        .filterWhere("mfs.is_active", "=", true)
        .as("monthly_sip"),
      eb.fn.min<string>("mfs.next_sip_date").as("next_sip_date"),
    ])
    .$if(!!category, (eb) =>
      eb.where("mfsum.saving_category", "=", category as string),
    )
    .executeTakeFirstOrThrow();

  // const breakdown = db.selectFrom().execute();

  const bestPerformer = db
    .selectFrom("mutual_fund_summary")
    .select(["scheme_name", "saving_category", "nav_diff_percentage"])
    .$if(!!category, (eb) =>
      eb.where("saving_category", "=", category as string),
    )
    .orderBy("nav_diff_percentage", "desc")
    .executeTakeFirstOrThrow();

  const worstPerformer = db
    .selectFrom("mutual_fund_summary")
    .select(["scheme_name", "saving_category", "nav_diff_percentage"])
    .$if(!!category, (eb) =>
      eb.where("saving_category", "=", category as string),
    )
    .orderBy("nav_diff_percentage", "asc")
    .executeTakeFirstOrThrow();

  const positiveCount = db
    .selectFrom("mutual_fund_summary")
    .where("net_invested", ">", 0)
    .select((eb) => [
      eb.fn
        .count<number>("scheme_name")
        .filterWhere("nav_diff_percentage", ">", 0)
        .as("positive"),
      eb.fn.count<number>("scheme_name").as("total"),
    ])
    .$if(!!category, (eb) =>
      eb.where("saving_category", "=", category as string),
    )
    .executeTakeFirstOrThrow();

  const performanceData = db
    .selectFrom("mutual_fund_summary")
    .innerJoin("savings_categories as sc", "name", "saving_category")
    .innerJoin(
      "mutual_fund_schemes",
      "mutual_fund_schemes.scheme_name",
      "mutual_fund_summary.scheme_name",
    )
    .$if(!category, (eb) =>
      eb
        .select((eb) => [
          "sc.icon as icon",
          "sc.name as name",
          "sc.name as iconAlt",
          eb
            .fn<string>("concat", [
              eb.fn.count("mutual_fund_summary.scheme_name"),
              sql.lit(" schemes"),
            ])
            .as("subtitle"),
          eb
            .fn<string>("concat", [sql.lit("category/"), "sc.name"])
            .as("action_route"),

          eb.fn.sum<number>("mutual_fund_schemes.sip_amount").as("monthly_sip"),
          net_current.as("current"),
          net_invested.as("invested"),
          returns.as("returns"),
          returns_percentage.as("returns_percentage"),
        ])
        .groupBy(["sc.name", "sc.icon", "sc.created_at"])
        .orderBy("sc.created_at", "asc"),
    )
    .$if(!!category, (eb) =>
      eb
        .select([
          "mutual_fund_schemes.scheme_name as name",
          "mutual_fund_schemes.logo as icon",
          "mutual_fund_schemes.sub_category as subtitle",
          "mutual_fund_schemes.sip_amount as monthly_sip",
          net_current.as("current"),
          net_invested.as("invested"),
          returns.as("returns"),
          returns_percentage.as("returns_percentage"),
        ])
        .where("mutual_fund_summary.saving_category", "=", category as string)
        .groupBy([
          "mutual_fund_schemes.scheme_name",
          "mutual_fund_schemes.logo",
          "mutual_fund_schemes.sub_category",
          "mutual_fund_schemes.sip_amount",
        ]),
    )
    .execute();

  const goals = db
    .selectFrom("goal as g")
    .innerJoin("savings_categories as sc", "sc.name", "g.name")
    .innerJoin("mutual_fund_summary as mfs", "mfs.saving_category", "g.name")
    .select((eb) => [
      "g.name",
      "g.target",
      "sc.icon",
      net_current.as("current"),
      eb
        .case()
        .when(net_current, ">=", eb.ref("g.target").$castTo<string>())
        .then("0")
        .else(eb(eb.ref("g.target").$castTo<string>(), "-", net_current))
        .end()
        .as("remaining"),
      eb
        .case()
        .when(net_current, ">=", eb.ref("g.target").$castTo<string>())
        .then("100")
        .else(
          eb.fn<string>("round", [
            eb(
              eb(net_current, "/", eb.ref("g.target").$castTo<string>()),
              "*",
              "100",
            ),
            eb.lit<number>(2),
          ]),
        )
        .end()
        .as("progress"),
      eb
        .case()
        .when(net_current.$castTo<number>(), ">=", eb.ref("g.target"))
        .then(true)
        .else(false)
        .end()
        .as("is_complete"),
    ])
    .groupBy(["g.name", "g.target", "sc.icon"])
    .execute();

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

  return {
    summary,
    stats,
    analysis: { bestPerformer, worstPerformer, positiveCount },
    performanceData,
    goals,
    recentTransactions,
  };
}
