import { type CashFlow, xirr } from "@webcarrot/xirr";

import { db } from "./kysely.server";

async function getXirrSummary(category?: string) {
  const { net_current } = await db
    .selectFrom("transactions as t")
    .innerJoin("mutual_fund_schemes as mfs", "mfs.scheme_name", "t.scheme_name")
    .select((eb) =>
      eb.fn
        .coalesce(
          eb.fn.sum(
            eb
              .case()
              .when(eb.ref("t.transaction_type"), "=", "purchase")
              .then(eb(eb.ref("t.units"), "*", eb.ref("mfs.nav")))
              .when(eb.ref("t.transaction_type"), "=", "redeem")
              .then(eb(eb(eb.ref("t.units"), "*", eb.ref("mfs.nav")), "*", -1))
              .else(eb.lit(0))
              .end(),
          ),
          eb.lit(0),
        )
        .as("net_current"),
    )
    .$if(!!category, (eb) =>
      eb.where("mfs.saving_category", "=", category as string),
    )
    .executeTakeFirstOrThrow();

  const cashFlows = await db
    .selectFrom("transactions as t")
    .innerJoin("mutual_fund_schemes as mfs", "mfs.scheme_name", "t.scheme_name")
    .select((eb) => [
      "t.date",
      eb
        .case()
        .when(eb.ref("t.transaction_type"), "=", "purchase")
        .then(eb("t.amount", "*", -1))
        .else(eb.ref("t.amount"))
        .end()
        .as("amount"),
    ])
    .$if(!!category, (eb) =>
      eb.where("mfs.saving_category", "=", category as string),
    )
    .orderBy("t.date", "asc")
    .execute();

  if (cashFlows.length === 0) return 0;

  return (
    xirr([
      ...cashFlows.map((flow) => ({ ...flow, amount: Number(flow.amount) })),
      { date: new Date(), amount: Number(net_current) },
    ] as unknown as CashFlow[]) * 100
  );
}

async function getXirrScheme(category?: string) {
  const result: Record<string, number> = {};

  if (category) {
    const schemes = await db
      .selectFrom("mutual_fund_schemes")
      .select(["scheme_name as name"])
      .where("saving_category", "=", category)
      .execute();

    for (const scheme of schemes) {
      const { net_current } = await db
        .selectFrom("mutual_fund_summary")
        .select("net_current")
        .where("scheme_name", "=", scheme.name)
        .executeTakeFirstOrThrow();

      const cashFlows = await db
        .selectFrom("transactions as t")
        .select((eb) => [
          "date",
          eb
            .case()
            .when(eb.ref("t.transaction_type"), "=", "purchase")
            .then(eb("t.amount", "*", -1))
            .else(eb.ref("t.amount"))
            .end()
            .as("amount"),
        ])
        .where("t.scheme_name", "=", scheme.name)
        .orderBy("t.date", "asc")
        .execute();

      result[scheme.name] =
        xirr([
          ...cashFlows.map((flow) => ({
            ...flow,
            amount: Number(flow.amount),
          })),
          { date: new Date(), amount: Number(net_current) },
        ] as unknown as CashFlow[]) * 100;
    }
  } else {
    const savingCategories = await db
      .selectFrom("savings_categories")
      .select(["name"])
      .execute();

    for (const category of savingCategories) {
      result[category.name] = await getXirrSummary(category.name);
    }
  }

  return result;
}

export async function getXIRR(category?: string) {
  return {
    summary: await getXirrSummary(category),
    scheme: await getXirrScheme(category),
  };
}
