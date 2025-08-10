import { Card, Center, Divider, List, Text } from "@mantine/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Section } from "#/components/section";
import type { getRecentTransactions } from "#/utils/getOverviewStats.server";

import { TransactionItem } from "./transaction-item";

dayjs.extend(customParseFormat);

type Transactions = Awaited<ReturnType<typeof getRecentTransactions>>;

export function RecentActivity(props: { transactions: Transactions }) {
  return (
    <Section title="Recent Activity">
      <Card withBorder>
        <List spacing="md">
          {props.transactions.length > 0 ? (
            props.transactions.map((transaction, index) => (
              <List.Item key={transaction.id}>
                <TransactionItem transaction={transaction} />
                {index < props.transactions.length - 1 && <Divider mt="md" />}
              </List.Item>
            ))
          ) : (
            <List.Item>
              <Center py="xl">
                <Text c="dimmed">No recent transactions</Text>
              </Center>
            </List.Item>
          )}
        </List>
      </Card>
    </Section>
  );
}
