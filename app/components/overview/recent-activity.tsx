import {
  Badge,
  Box,
  Card,
  Center,
  Divider,
  Group,
  Image,
  List,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { Section } from "#/components/section";
import { TRANSACTION_TYPE } from "#/constants/transaction_type";
import type { getRecentTransactions } from "#/utils/getOverviewStats.server";

dayjs.extend(customParseFormat);

export function RecentActivity(props: {
  transactions: Awaited<ReturnType<typeof getRecentTransactions>>;
}) {
  return (
    <Section title="Recent Activity">
      <Card withBorder>
        <List spacing="md">
          {props.transactions.length > 0 ? (
            props.transactions.map((transaction, index) => {
              const isPurchase =
                transaction.transaction_type === TRANSACTION_TYPE.PURCHASE;

              return (
                <List.Item key={transaction.id}>
                  <Group align="flex-start">
                    {transaction.logo ? (
                      <Image
                        radius="md"
                        w="auto"
                        h={28}
                        mt={2}
                        src={transaction.logo}
                        alt={transaction.scheme_name}
                      />
                    ) : null}
                    <Box>
                      <Text fw={500} size="sm" lineClamp={1}>
                        {transaction.scheme_name}
                      </Text>
                      <Group gap="xs" mt={6} wrap="wrap">
                        <Badge variant="light" color="gray" size="xs">
                          {transaction.saving_category}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {dayjs(transaction.date).format("DD MMM, YYYY")}
                        </Text>
                      </Group>
                    </Box>
                    <Stack ml="auto" gap={6} ta="right">
                      <Text fw={500} size="sm">
                        {isPurchase ? "+" : "-"}
                        <CurrencyFormatter value={transaction.amount} />
                      </Text>
                      <Text size="xs" c="dimmed">
                        {transaction.units} units
                      </Text>
                    </Stack>
                  </Group>

                  {index < props.transactions.length - 1 && <Divider mt="md" />}
                </List.Item>
              );
            })
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

{
  /* <Stack gap="md">
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
                  <Group
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                    gap="md"
                  >
                    <Group
                      gap={{ base: "sm", sm: "md" }}
                      align="flex-start"
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      <ThemeIcon
                        variant="light"
                        color={isPurchase ? "blue" : "orange"}
                        size={{ base: "md", sm: "lg" }}
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
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          fw={600}
                          size={{ base: "xs", sm: "sm" }}
                          lineClamp={1}
                        >
                          {transaction.scheme_name}
                        </Text>
                        <Group gap="xs" mt={2} wrap="wrap">
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
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <Text
                        fw={600}
                        size={{ base: "xs", sm: "sm" }}
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
                    <Divider my={{ base: "xs", sm: "sm" }} />
                  )}
                </div>
              );
            })
          ) : (
            <Center py="xl">
              <Text c="dimmed">No recent transactions</Text>
            </Center>
          )}
        </Stack> */
}
