import { db } from "./kysely.server";

export async function getNetCurrentGoal() {
  const { net_current } = await db
    .selectFrom("mutual_fund_summary")
    .select((eb) =>
      eb.fn<number>("round", [eb.fn.sum("net_current")]).as("net_current"),
    )
    .executeTakeFirstOrThrow();

  const { monthly_sip } = await db
    .selectFrom("mutual_fund_schemes")
    .select((eb) => eb.fn.sum("sip_amount").as("monthly_sip"))
    .executeTakeFirstOrThrow();

  return db
    .selectFrom("goals as g")
    .innerJoin("savings_categories as sc", "sc.name", "g.name")
    .select((eb) => [
      "g.name",
      "sc.icon",
      "g.target",
      eb.val(net_current).$castTo<string>().as("current"),
      eb.val(monthly_sip).$castTo<string>().as("monthly_sip"),
      eb
        .case()
        .when(eb.val(net_current), ">=", eb.ref("g.target"))
        .then("0")
        .else(eb(eb.ref("g.target"), "-", eb.val(net_current)))
        .end()
        .$castTo<string>()
        .as("remaining"),
      eb
        .case()
        .when(eb.val(net_current), ">=", eb.ref("g.target"))
        .then("100")
        .else(
          eb.fn<string>("round", [
            eb(
              eb(eb.val(net_current), "/", eb.ref("g.target")),
              "*",
              eb.lit(100),
            ),
            eb.lit(2),
          ]),
        )
        .end()
        .as("progress"),
      eb
        .case()
        .when(eb.val(net_current), ">=", eb.ref("g.target"))
        .then(true)
        .else(false)
        .end()
        .as("is_complete"),
    ])
    .where("sc.name", "=", "Net Current")
    .executeTakeFirst();
}
