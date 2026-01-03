import { Card, SimpleGrid, Text } from "@mantine/core";
import { redirect } from "react-router";

import { AddTransactionsForm } from "#/components/forms/add-transactions-form";
import { Section } from "#/components/shared/section";
import { db } from "#/database/kysely.server";
import { requireAuth } from "#/middlewares/requireAuth";

import type { Route } from "./+types/add-transactions";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  const schemes = await db
    .selectFrom("mutual_fund_schemes")
    .select(["id", "scheme_name", "saving_category", "logo", "sip_amount"])
    .execute();

  return { schemes };
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return { error: "Method not allowed" };
  }

  await requireAuth(request);

  const formData = await request.formData();
  const transactions = JSON.parse(formData.get("transactions") as string);
  console.log(transactions);
  return null;

  // Insert transactions into database
  // await db
  //   .insertInto("mutual_fund_transactions")
  //   .values(transactions)
  //   .execute();

  // return redirect("/private/transactions");
}

export default function AddTransactions({ loaderData }: Route.ComponentProps) {
  return (
    <Section mt="md" title="Add Transactions">
      <AddTransactionsForm schemes={loaderData.schemes} />
    </Section>
  );
}
