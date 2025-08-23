import { db } from "./kysely.server";

export async function getSipBreakdown(category?: string) {
  return db
    .selectFrom("sip_breakdown")
    .selectAll()
    .where("category", category ? "=" : "is", category ? category : null)
    .execute();
}
