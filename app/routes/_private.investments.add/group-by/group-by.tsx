import { Grid, TextInput } from "@mantine/core";

import { Section } from "#/components/shared/section";

import { DateField } from "../date-field";
import { FundNameField } from "../fund-name-field";
import { useTransactionFormContext } from "../transaction-form-context";
import { TransactionTypeField } from "../transaction-type-field";

export function GroupBy() {
  const form = useTransactionFormContext();

  return (
    <Section title="Group By">
      <Grid>
        <Grid.Col span={{ base: 12, xs: 3 }}>
          <DateField
            clearable
            label="Transaction date"
            key={form.key("group_date")}
            {...form.getInputProps("group_date")}
            onChange={(value) => {
              form.getInputProps("group_date").onChange(value);
              if (value) {
                form.getValues().transactions.forEach((_, index) => {
                  form.setFieldValue(`transactions.${index}.date`, value);
                });
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <FundNameField
            clearable
            label="Fund name"
            {...form.getInputProps("group_fund_name")}
            onChange={(value) => {
              form.getInputProps("group_fund_name").onChange(value);
              if (value) {
                form.getValues().transactions.forEach((_, index) => {
                  form.setFieldValue(`transactions.${index}.fund_name`, value);
                });
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 3 }}>
          <TransactionTypeField
            clearable
            label="Transaction type"
            {...form.getInputProps("group_transaction_type")}
            onChange={(value) => {
              form.getInputProps("group_transaction_type").onChange(value);
              if (value) {
                form.getValues().transactions.forEach((_, index) => {
                  form.setFieldValue(
                    `transactions.${index}.transaction_type`,
                    value,
                  );
                });
              }
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 3 }}>
          <TextInput
            label="Transaction amount"
            placeholder="Enter transaction amount"
            {...form.getInputProps("group_transaction_amount")}
            onChange={(event) => {
              form.getInputProps("group_transaction_amount").onChange(event);
              if (event) {
                form.getValues().transactions.forEach((_, index) => {
                  form.setFieldValue(
                    `transactions.${index}.amount`,
                    event.target.value,
                  );
                });
              }
            }}
          />
        </Grid.Col>
      </Grid>
    </Section>
  );
}
