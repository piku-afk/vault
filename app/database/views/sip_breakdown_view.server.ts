import type { Kysely } from "kysely";

import {
  logViewCreation,
  logViewCreationError,
  setSecurityInvoker,
} from "#/utils/view-utils.server";

import type { KyselyDatabase } from "../kysely.server";

export const SIP_BREAKDOWN_VIEW = "sip_breakdown";

export async function createSipBreakdownView(db: Kysely<KyselyDatabase>) {
  try {
    logViewCreation(SIP_BREAKDOWN_VIEW);

    await db.schema
      .createView(SIP_BREAKDOWN_VIEW)
      .orReplace()
      .as(
        db
          .with("savings_category_sips", (db) =>
            db
              .selectFrom("savings_categories as sc")
              .leftJoin(
                "mutual_fund_schemes as mfs",
                "mfs.saving_category",
                "sc.name",
              )
              .select((eb) => [
                eb.lit(null).$castTo<string | null>().as("category"),
                "sc.name",
                eb.fn
                  .coalesce(eb.fn.sum("mfs.sip_amount"), eb.lit(0))
                  .as("sip_amount"),
                "sc.color as color",
                "sc.id as id",
              ])
              .groupBy(["sc.name", "sc.color", "sc.id"])
              .orderBy((eb) =>
                eb
                  .case("name")
                  .when("Emergency")
                  .then(1)
                  .when("Home")
                  .then(2)
                  .when("Bike")
                  .then(3)
                  .when("Long Term")
                  .then(4)
                  .end(),
              ),
          )
          .with("sub_category_sips", (db) =>
            db
              .selectFrom("mutual_fund_schemes as mfs")
              .leftJoin(
                "savings_categories as sc",
                "sc.name",
                "mfs.saving_category",
              )
              .select((eb) => [
                "sc.name as category",
                "mfs.sub_category as name",
                eb.fn
                  .coalesce(eb.fn.sum("mfs.sip_amount"), eb.lit(0))
                  .as("sip_amount"),
                "mfs.color as color",
                "mfs.id as id",
              ])
              .groupBy(["sc.name", "mfs.id", "mfs.sub_category", "mfs.color"])
              .orderBy("mfs.sip_amount", "asc"),
          )
          .selectFrom("savings_category_sips")
          .selectAll()
          .unionAll((eb) => eb.selectFrom("sub_category_sips").selectAll())
          .orderBy("category", (ob) => ob.nullsFirst()),
      )
      .execute();

    await setSecurityInvoker(SIP_BREAKDOWN_VIEW, db);
  } catch (error) {
    logViewCreationError(SIP_BREAKDOWN_VIEW, error);
  }
}
