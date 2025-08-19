import { expressionBuilder } from "kysely";

import { type Database, db } from "./kysely.server";

const mfsumEb = expressionBuilder<Database, "mutual_fund_summary">();
const mfsum_net_current = mfsumEb.fn<string>("round", [
  mfsumEb.fn.sum("net_current"),
]);

export async function getGoalsProgress() {
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

  const netCurrentGoal = await db
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

  const goals = await db
    .selectFrom(
      db
        .selectFrom("goals as g")
        .innerJoin("savings_categories as sc", "sc.name", "g.name")
        .innerJoin(
          "mutual_fund_summary as mfsum",
          "mfsum.saving_category",
          "g.name",
        )
        .select((eb) => [
          "g.name",
          "g.target",
          "sc.icon",
          mfsum_net_current.as("current"),
          eb
            .case()
            .when(mfsum_net_current, ">=", eb.ref("g.target").$castTo<string>())
            .then("0")
            .else(
              eb(eb.ref("g.target").$castTo<string>(), "-", mfsum_net_current),
            )
            .end()
            .as("remaining"),
          eb
            .case()
            .when(mfsum_net_current, ">=", eb.ref("g.target").$castTo<string>())
            .then("100")
            .else(
              eb.fn<string>("round", [
                eb(
                  eb(
                    mfsum_net_current,
                    "/",
                    eb.ref("g.target").$castTo<string>(),
                  ),
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
            .when(mfsum_net_current.$castTo<number>(), ">=", eb.ref("g.target"))
            .then(true)
            .else(false)
            .end()
            .as("is_complete"),
        ])
        .groupBy(["g.name", "g.target", "sc.icon", "g.created_at"])
        .orderBy("g.created_at", "asc")
        .as("goals_progress"),
    )
    .innerJoin("mutual_fund_schemes as mfs", "mfs.saving_category", "name")
    .select((eb) => [
      "name",
      "icon",
      "target",
      "current",
      "remaining",
      "progress",
      "is_complete",
      eb.fn.sum("mfs.sip_amount").as("monthly_sip"),
    ])
    .groupBy([
      "name",
      "icon",
      "target",
      "current",
      "remaining",
      "progress",
      "is_complete",
    ])
    .execute();

  return [netCurrentGoal, ...goals];
}
