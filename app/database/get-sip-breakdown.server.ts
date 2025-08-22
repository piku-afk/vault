import type { InferResult } from "kysely";

import { createDatabaseInstance } from "./kysely.server";

export async function getSipBreakdown(category?: string) {
  const db = createDatabaseInstance();
  const query = db
    .selectFrom("mutual_fund_schemes as mfs")
    .innerJoin("savings_categories as sc", "mfs.saving_category", "sc.name")
    .select((eb) => eb.fn.sum<number>("sip_amount").as("monthly_sip"))
    // if no category is provided, group by saving_category
    .$if(!category, (qb) =>
      qb
        .select(["sc.id", "sc.name", "sc.color"])
        .orderBy("sc.created_at")
        .groupBy(["sc.id", "sc.name", "sc.color", "sc.created_at"]),
    )
    // if a category is provided, group by scheme_name
    .$if(!!category, (qb) =>
      qb
        .select(["mfs.id", "mfs.sub_category as name", "mfs.color"])
        .where("mfs.saving_category", "=", category as string)
        .orderBy("mfs.created_at")
        .groupBy(["mfs.id", "mfs.sub_category", "mfs.color", "mfs.created_at"]),
    );

  let sipBreakdown: InferResult<typeof query>;

  try {
    sipBreakdown = await query.execute();
  } finally {
    await db.destroy();
  }

  return sipBreakdown;
}
