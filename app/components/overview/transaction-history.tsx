import { Card, Center, Divider, List, Text } from "@mantine/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/section";
import { useOverviewLoaderData } from "#/routes/private/overview";

import { TransactionItem, TransactionItemSkeleton } from "./transaction-item";

dayjs.extend(customParseFormat);

export function TransactionHistory() {
  const loaderData = useOverviewLoaderData();

  return (
    <Section title="Transaction History">
      <Card withBorder>
        <List spacing="md">
          <Suspense
            fallback={Array.from(Array(5).keys()).map((item, index, array) => (
              <List.Item key={item}>
                <TransactionItemSkeleton key={item} />
                {index < array.length - 1 && <Divider mt="md" />}
              </List.Item>
            ))}
          >
            <Await resolve={loaderData.recentTransactions}>
              {(recentTransactions) =>
                recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction, index, array) => (
                    <List.Item key={transaction.id}>
                      <TransactionItem transaction={transaction} />
                      {index < array.length - 1 && <Divider mt="md" />}
                    </List.Item>
                  ))
                ) : (
                  <List.Item>
                    <Center py="xl">
                      <Text c="dimmed">No recent transactions</Text>
                    </Center>
                  </List.Item>
                )
              }
            </Await>
          </Suspense>
        </List>
      </Card>
    </Section>
  );
}
