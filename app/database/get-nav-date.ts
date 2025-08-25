import { db } from "./kysely.server";

export async function getNavDate() {
  const { nav_date } = await db
    .selectFrom("mutual_fund_schemes")
    .select((eb) => eb.fn.max("nav_date").as("nav_date"))
    .executeTakeFirstOrThrow();

  return nav_date;
}
