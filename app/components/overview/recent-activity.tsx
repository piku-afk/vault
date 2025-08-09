import {
  Badge,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Activity, ArrowUpRight } from "lucide-react";

import { CurrencyFormatter } from "#/components/currency-formatter";

interface Transaction {
  id: string;
  scheme_name: string;
  transaction_type: string;
  amount: number;
  units: number;
  date: string;
  saving_category: string;
}

interface RecentActivityProps {
  transactions: Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <Card withBorder radius="lg" p="lg">
      <Stack gap="md">
        {transactions.length > 0 ? (
          transactions.slice(0, 6).map((transaction, index) => {
            const isPurchase = transaction.transaction_type === "Purchase";
            const transactionDate = new Date(transaction.date);
            const isToday =
              transactionDate.toDateString() === new Date().toDateString();
            const isThisWeek =
              (Date.now() - transactionDate.getTime()) /
                (1000 * 60 * 60 * 24) <=
              7;

            return (
              <div key={transaction.id}>
                <Group justify="space-between" align="flex-start">
                  <Group gap="md" align="flex-start">
                    <ThemeIcon
                      variant="light"
                      color={isPurchase ? "blue" : "orange"}
                      size="lg"
                      radius="md"
                    >
                      <ArrowUpRight
                        size={18}
                        style={{
                          transform: isPurchase
                            ? "rotate(0deg)"
                            : "rotate(180deg)",
                        }}
                      />
                    </ThemeIcon>
                    <div>
                      <Text fw={600} size="sm" lineClamp={1}>
                        {transaction.scheme_name}
                      </Text>
                      <Group gap="xs" mt={2}>
                        <Badge variant="light" color="gray" size="xs">
                          {transaction.saving_category}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {isToday
                            ? "Today"
                            : isThisWeek
                              ? transactionDate.toLocaleDateString("en-US", {
                                  weekday: "short",
                                })
                              : transactionDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                        </Text>
                      </Group>
                    </div>
                  </Group>
                  <div style={{ textAlign: "right" }}>
                    <Text
                      fw={600}
                      size="sm"
                      c={isPurchase ? "blue.7" : "orange.7"}
                    >
                      {isPurchase ? "+" : "-"}
                      <CurrencyFormatter value={transaction.amount} />
                    </Text>
                    <Text size="xs" c="dimmed">
                      {transaction.units} units
                    </Text>
                  </div>
                </Group>
                {index < transactions.slice(0, 6).length - 1 && (
                  <Divider my="sm" />
                )}
              </div>
            );
          })
        ) : (
          <Group
            gap="md"
            c="dimmed"
            style={{ justifyContent: "center", padding: "2rem 0" }}
          >
            <Activity size={24} />
            <Text>No recent transactions</Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
