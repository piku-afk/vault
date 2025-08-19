import { type CashFlow, xirr } from "@webcarrot/xirr";

import { db } from "./kysely.server";

function calculateXirr(cashFlows: CashFlow[], netCurrent: string): number {
  if (cashFlows.length === 0) return 0;

  const xirrCashFlows: CashFlow[] = [
    ...cashFlows.map((flow) => ({ ...flow, amount: Number(flow.amount) })),
    { date: new Date(), amount: Number(netCurrent) },
  ];

  return xirr(xirrCashFlows) * 100;
}

async function getNetCurrentValue(category?: string): Promise<string> {
  const query = db
    .selectFrom("transactions as t")
    .innerJoin("mutual_fund_schemes as mfs", "mfs.scheme_name", "t.scheme_name")
    .select((eb) =>
      eb.fn
        .sum(
          eb
            .case()
            .when(eb.ref("t.transaction_type"), "=", "purchase")
            .then(eb(eb.ref("t.units"), "*", eb.ref("mfs.nav")))
            .when(eb.ref("t.transaction_type"), "=", "redeem")
            .then(eb(eb(eb.ref("t.units"), "*", eb.ref("mfs.nav")), "*", -1))
            .else(eb.lit(0))
            .end(),
        )
        .$castTo<string>()
        .as("net_current"),
    )
    .$if(!!category, (eb) =>
      eb.where("mfs.saving_category", "=", category as string),
    );

  const { net_current } = await query.executeTakeFirstOrThrow();
  return net_current;
}

async function getCashFlows({
  category,
  schemeName,
}: {
  category?: string;
  schemeName?: string;
}): Promise<CashFlow[]> {
  const query = db
    .selectFrom("transactions as t")
    .select((eb) => [
      eb.cast<Date>("t.date", "date").as("date"),
      eb
        .case()
        .when(eb.ref("t.transaction_type"), "=", "purchase")
        .then(eb("t.amount", "*", -1))
        .else(eb.ref("t.amount"))
        .end()
        .as("amount"),
    ])
    .$if(!!schemeName, (eb) =>
      eb.where("t.scheme_name", "=", schemeName as string),
    )
    .$if(!!category, (eb) =>
      eb
        .innerJoin(
          "mutual_fund_schemes as mfs",
          "mfs.scheme_name",
          "t.scheme_name",
        )
        .where("mfs.saving_category", "=", category as string),
    );

  return query.orderBy("t.date", "asc").execute();
}

async function getXirrSummary(category?: string): Promise<number> {
  const cashFlows = await getCashFlows({ category });
  const netCurrent = await getNetCurrentValue(category);

  return calculateXirr(cashFlows, netCurrent);
}

async function getXirrScheme(
  category?: string,
): Promise<Record<string, number>> {
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
        .select((eb) =>
          eb.cast<string>("net_current", "numeric").as("net_current"),
        )
        .where("scheme_name", "=", scheme.name)
        .executeTakeFirstOrThrow();

      const cashFlows = await getCashFlows({ schemeName: scheme.name });
      result[scheme.name] = calculateXirr(cashFlows, net_current);
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
