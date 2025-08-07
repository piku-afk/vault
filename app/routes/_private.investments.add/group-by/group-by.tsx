import { Grid } from "@mantine/core";
import { Section } from "#/routes/_private.investments._index/section";
import { DateField } from "../date-field";
import { FundNameField } from "../fund-name-field";
import { useTransactionForm } from "../transaction-form-context";
import { TransactionTypeField } from "../transaction-type-field";

export function GroupBy() {
  const form = useTransactionForm();

  return (
    <Section title="Group By">
      <Grid>
        <Grid.Col span={{ base: 12, xs: 3 }}>
          <DateField
            clearable
            label="Transaction date"
            {...form.getInputProps("group_date")}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <FundNameField
            clearable
            label="Fund name"
            placeholder="Search by fund name"
            {...form.getInputProps("group_fund_name")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 3 }}>
          <TransactionTypeField
            clearable
            label="Transaction type"
            placeholder="Search by transaction type"
            {...form.getInputProps("group_transaction_type")}
          />
        </Grid.Col>
      </Grid>
    </Section>
  );
}
