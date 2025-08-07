import {
  Button,
  Card,
  CloseButton,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Plus } from "lucide-react";

import { Section } from "../../_private.investments._index/section";
import { DateField } from "../date-field";
import { FundNameField } from "../fund-name-field";
import {
  defaultTransaction,
  useTransactionFormContext,
} from "../transaction-form-context";
import { TransactionTypeField } from "../transaction-type-field";

export function Transactions() {
  const form = useTransactionFormContext();

  function addTransaction() {
    form.insertListItem("transactions", {
      ...defaultTransaction,
      date: form.getValues().group_date || "",
      transaction_type: form.getValues().group_transaction_type || "",
      fund_name: form.getValues().group_fund_name || "",
      amount: form.getValues().group_transaction_amount || "",
    });
  }

  return (
    <Section title={`Transactions (${form.getValues().transactions.length})`}>
      <Stack gap="lg">
        {form.getValues().transactions.map((_, index) => (
          <Card
            key={form.key(`transactions.${index}`)}
            withBorder
            bg="violet.0"
          >
            <Group justify="space-between">
              <Text>Transaction {index + 1}</Text>
              <CloseButton
                onClick={() => form.removeListItem("transactions", index)}
              />
            </Group>
            <Grid mt="sm">
              <Grid.Col span={{ base: 12, xs: 3 }}>
                <DateField
                  disabled={!!form.getValues().group_date}
                  {...form.getInputProps(`transactions.${index}.date`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6 }}>
                <FundNameField
                  disabled={!!form.getValues().group_fund_name}
                  {...form.getInputProps(`transactions.${index}.fund_name`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 3 }}>
                <TransactionTypeField
                  disabled={!!form.getValues().group_transaction_type}
                  {...form.getInputProps(
                    `transactions.${index}.transaction_type`,
                  )}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 4 }}>
                <TextInput
                  placeholder="Enter units"
                  type="number"
                  {...form.getInputProps(`transactions.${index}.units`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 4 }}>
                <TextInput
                  placeholder="Enter NAV"
                  type="number"
                  {...form.getInputProps(`transactions.${index}.nav`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 4 }}>
                <TextInput
                  disabled={!!form.getValues().group_transaction_amount}
                  type="number"
                  placeholder="Enter amount"
                  {...form.getInputProps(`transactions.${index}.amount`)}
                />
              </Grid.Col>
            </Grid>
          </Card>
        ))}
      </Stack>

      <Button
        display="block"
        mt="lg"
        ml="auto"
        variant="default"
        leftSection={<Plus size={16} />}
        onClick={addTransaction}
      >
        Add transaction
      </Button>
    </Section>
  );
}
