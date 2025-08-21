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
  // TODO: add a summary table with name, subtext, badgeText, and create a view to calculate values
  const summary = db
    .selectFrom("mutual_fund_summary")
    .select([
      net_current.as("net_current"),
      net_invested.as("net_invested"),
      returns.as("net_returns"),
      returns_percentage.as("net_returns_percentage"),
    ])
    .$if(!!category, (eb) =>
      eb.where("saving_category", "=", category as string),
    )
    .executeTakeFirstOrThrow();

  const stats = db
    .selectFrom("saving_category_stats")
    .selectAll()
    .where("category", category ? "=" : "is", category ? category : null)
    .orderBy("category", "desc")
    .executeTakeFirstOrThrow();

  // TODO: convert to view
  const breakdown = db
    .selectFrom(
      db
        .selectFrom("mutual_fund_summary")
        .$if(!category, (eb) =>
          eb
            .innerJoin("savings_categories", "name", "saving_category")
            .select([
              "savings_categories.id",
              "name",
              "color",
              net_current.as("current"),
            ])
            .groupBy(["savings_categories.id", "name", "color", "created_at"])
            .orderBy("created_at", "asc"),
        )
        .$if(!!category, (eb) =>
          eb
            .innerJoin(
              "mutual_fund_schemes as mfs",
              "mfs.scheme_name",
              "mutual_fund_summary.scheme_name",
            )
            .select([
              "mfs.id",
              "mfs.sub_category as name",
              "mfs.color as color",
              net_current.as("current"),
            ])
            .where("mfs.saving_category", "=", category as string)
            .groupBy([
              "mfs.id",
              "mfs.sub_category",
              "mfs.color",
              "mfs.created_at",
            ])
            .orderBy("mfs.created_at", "asc"),
        )
        .as("summary"),
    )
    .select((eb) => [
      "id",
      "name",
      "color",
      eb
        .fn<number>("round", [
          eb(
            eb(
              eb.ref("current").$castTo<number>(),
              "/",
              eb.fn.sum<number>("current").over(),
            ),
            "*",
            eb.lit<number>(100),
          ),
          eb.lit(2),
        ])
        .as("allocation_percentage"),
    ])
    .execute();

  const monthlyPerformers = db
    .selectFrom(
      db
        .selectFrom("mutual_fund_summary as mfsum")
        .leftJoin(
          "mutual_fund_schemes as mfs",
          "mfs.scheme_name",
          "mfsum.scheme_name",
        )
        .$if(!!category, (eb) =>
          eb
            .select("mfs.sub_category as sub_text")
            .where("mfs.saving_category", "=", category as string),
        )
        .$if(!category, (eb) => eb.select("mfs.saving_category as sub_text"))
        .select([
          "mfs.scheme_name",
          "mfsum.nav_diff_percentage",
          sql<number>`row_number() over (order by nav_diff_percentage asc)`.as(
            "worst_performer",
          ),
          sql<number>`row_number() over (order by nav_diff_percentage desc)`.as(
            "best_performer",
          ),
        ])
        .as("mutual_fund_scheme_ranks"),
    )
    .select(["scheme_name", "sub_text", "nav_diff_percentage"])
    .where((eb) => eb("worst_performer", "=", 1).or("best_performer", "=", 1))
    .orderBy("nav_diff_percentage", "asc")
    .execute();

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

  const recentTransactions = db
    .selectFrom("transactions as t")
    .innerJoin("mutual_fund_schemes as mfs", "t.scheme_name", "mfs.scheme_name")
    .select((eb) => [
      "t.id",
      "t.date",
      "t.amount",
      "t.transaction_type",
      "t.scheme_name as name",
      "t.units",
      "t.nav",
      "mfs.logo as icon",
      eb("transaction_type", "=", "purchase")
        .$castTo<boolean>()
        .as("is_purchase"),
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
    analysis: {
      breakdown,
      monthlyPerformers,
      positiveCount,
    },
    performanceData,
    recentTransactions,
  };
}
