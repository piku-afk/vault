import { Card, Center, Divider, List, Text } from "@mantine/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/section";
import type { getRecentTransactions } from "#/utils/getOverviewStats.server";

import { TransactionItem, TransactionItemSkeleton } from "./transaction-item";

dayjs.extend(customParseFormat);

export function RecentActivity(props: {
  transactions: ReturnType<typeof getRecentTransactions>;
}) {
  return (
    <Section title="Recent Activity">
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
            <Await resolve={props.transactions}>
              {(transactions) =>
                transactions.length > 0 ? (
                  transactions.map((transaction, index, array) => (
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
