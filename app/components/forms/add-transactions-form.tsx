import {
  Button,
  Card,
  Grid,
  Group,
  Image,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useState } from "react";
import { Form } from "react-router";

interface Scheme {
  id: string;
  scheme_name: string;
  saving_category: string;
  logo: string;
  sip_amount: number;
}

interface Transaction {
  schemeId: string;
  date: string;
  nav: number;
  units: number;
  amount: number;
}

interface AddTransactionsFormProps {
  schemes: Scheme[];
}

export function AddTransactionsForm({ schemes }: AddTransactionsFormProps) {
  const [transactions, setTransactions] = useState<Record<string, Transaction>>(
    schemes.reduce(
      (acc, scheme) => ({
        ...acc,
        [scheme.id]: {
          schemeId: scheme.id,
          date: new Date().toISOString().split("T")[0],
          nav: 0,
          units: 0,
          amount: 0,
        },
      }),
      {},
    ),
  );

  const handleTransactionChange = (
    schemeId: string,
    field: keyof Transaction,
    value: string | number,
  ) => {
    setTransactions((prev) => {
      const updated = { ...prev };
      const transaction = { ...updated[schemeId] };

      if (field === "nav" || field === "units") {
        transaction[field] = Number(value);
        // Auto-calculate amount
        transaction.amount = Number(
          (transaction.nav * transaction.units).toFixed(2),
        );
      } else if (field === "amount") {
        transaction.amount = Number(value);
      } else {
        transaction[field] = value;
      }

      updated[schemeId] = transaction;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append(
      "transactions",
      JSON.stringify(Object.values(transactions)),
    );
    e.currentTarget.submit();
  };

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <Stack gap="lg">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {schemes.map((scheme) => {
            const transaction = transactions[scheme.id];
            return (
              <Card key={scheme.id} withBorder p="md">
                <Stack gap="sm">
                  <Group>
                    <ThemeIcon mt={2} variant="default" size={"lg"}>
                      <Image
                        loading="lazy"
                        src={scheme.logo}
                        alt={scheme.scheme_name}
                        w="auto"
                        h={20}
                      />
                    </ThemeIcon>
                    <Text fw={600} size="sm">
                      {scheme.scheme_name}
                    </Text>
                  </Group>
                  <TextInput
                    label="Date"
                    type="date"
                    value={transaction.date}
                    onChange={(e) =>
                      handleTransactionChange(
                        scheme.id,
                        "date",
                        e.currentTarget.value,
                      )
                    }
                    size="sm"
                  />
                  <SimpleGrid cols={3} spacing="xs">
                    <NumberInput
                      label="NAV"
                      placeholder="0.00"
                      value={transaction.nav || ""}
                      onChange={(value) =>
                        handleTransactionChange(scheme.id, "nav", value)
                      }
                      step={0.01}
                      min={0}
                      size="sm"
                      decimalScale={2}
                    />

                    <NumberInput
                      label="Units"
                      placeholder="0.000"
                      value={transaction.units || ""}
                      onChange={(value) =>
                        handleTransactionChange(scheme.id, "units", value)
                      }
                      step={0.001}
                      min={0}
                      size="sm"
                      decimalScale={3}
                    />

                    <NumberInput
                      label="Amount"
                      placeholder="0.00"
                      value={transaction.amount || ""}
                      onChange={(value) =>
                        handleTransactionChange(scheme.id, "amount", value)
                      }
                      step={0.01}
                      min={0}
                      size="sm"
                      decimalScale={2}
                    />
                  </SimpleGrid>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>

        <Group justify="flex-end">
          <Button variant="default" type="reset" size="sm">
            Reset
          </Button>
          <Button type="submit" size="sm">
            Add Transactions
          </Button>
        </Group>
      </Stack>
    </Form>
  );
}
