import { Button, Divider, Group, Stack } from "@mantine/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { sql } from "kysely";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useFetcher, useSubmit } from "react-router";

import { db } from "#/utils/kysely.server";
import { Section } from "../_private.investments._index/section";
import type { Route } from "../_private.investments.add/+types/route";
import { GroupBy } from "./group-by/group-by";
import {
  defaultTransactionFormValues,
  TransactionFormProvider,
  type TransactionFormValues,
  transactionFormSchema,
  useTransactionForm,
} from "./transaction-form-context";
import { Transactions } from "./transactions/transactions";

dayjs.extend(customParseFormat);

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.json();

  await db.insertInto("transaction").values(formData).execute();
}

export async function loader() {
  const fundNames = await db
    .selectFrom("mutual_fund")
    .select(sql<string[]>`array_agg(fund_name)`.as("data"))
    .executeTakeFirstOrThrow();

  const transactionTypes = await db
    .selectFrom("transaction_type")
    .select(sql<string[]>`array_agg("name")`.as("data"))
    .executeTakeFirstOrThrow();

  return { fundNames, transactionTypes };
}

export default function InvestmentsAdd() {
  const fetcher = useFetcher();
  const submit = useSubmit();
  const form = useTransactionForm({
    mode: "controlled",
    validate: zod4Resolver(transactionFormSchema),
    initialValues: defaultTransactionFormValues,
  });

  async function handleSubmit(values: TransactionFormValues) {
    await submit(values.transactions, {
      method: "post",
      encType: "application/json",
    });
    form.reset();
  }

  const isLoading = fetcher.state === "submitting";

  return (
    <TransactionFormProvider form={form}>
      <fetcher.Form method="post" onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          <Section title="Add transactions" />
          <Divider />
          <GroupBy />
          <Divider />
          <Transactions />
          <Divider />
          <Group justify="flex-end" mb="xl" gap="md">
            <Button
              type="button"
              variant="default"
              disabled={isLoading}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" variant="default" loading={isLoading}>
              Add Transactions
            </Button>
          </Group>
        </Stack>
      </fetcher.Form>
    </TransactionFormProvider>
  );
}
