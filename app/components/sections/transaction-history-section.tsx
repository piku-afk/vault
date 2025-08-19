import {
  Badge,
  Box,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Image,
  List,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import advanceFormat from "dayjs/plugin/advancedFormat";
import { Suspense } from "react";
import { Await } from "react-router";

import type { getOverview } from "#/database/get-overview.server";

import { CurrencyFormatter } from "../shared/currency-formatter";
import { Section } from "../shared/section";

dayjs.extend(advanceFormat);

export function TransactionHistorySection(props: {
  title: string;
  data: ReturnType<typeof getOverview>["recentTransactions"];
}) {
  return (
    <Section title={props.title}>
      <Card withBorder>
        <List spacing="md">
          <Suspense
            fallback={Array.from(Array(5).keys()).map((item, index, array) => (
              <List.Item key={item}>
                <Grid gutter="lg">
                  <Grid.Col span={{ base: 12, xs: 6 }}>
                    <Group align="flex-start" wrap="nowrap">
                      <Skeleton height={28} width={28} radius="md" mt={2} />
                      <Box style={{ flex: 1 }}>
                        <Skeleton height={21} width="90%" mb={6} />
                        <Group gap="xs" mt={6} wrap="wrap">
                          <Skeleton height={16} width={80} radius="sm" />
                          <Skeleton height={12} width={100} />
                        </Group>
                      </Box>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, xs: 3 }}>
                    <Stack gap="xs" style={{ flexShrink: 0 }}>
                      <Skeleton height={12} width={100} />
                      <Skeleton height={12} width={100} />
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 6, xs: 3 }}>
                    <Stack gap="xs" align="flex-end" style={{ flexShrink: 0 }}>
                      <Skeleton height={16} width={120} />
                      <Skeleton height={12} width={80} />
                    </Stack>
                  </Grid.Col>
                </Grid>
                {index < array.length - 1 && <Divider mt="md" />}
              </List.Item>
            ))}
          >
            <Await resolve={props.data}>
              {(transactions) =>
                transactions.length > 0 ? (
                  transactions.map((transaction, index, array) => (
                    <List.Item key={transaction.id}>
                      <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, xs: 6 }}>
                          <Group gap="md" align="flex-start" wrap="nowrap">
                            {transaction.icon && (
                              <Image
                                loading="lazy"
                                radius="md"
                                w="auto"
                                h={28}
                                mt={2}
                                src={transaction.icon}
                                alt={transaction.name}
                              />
                            )}
                            <Box>
                              <Text fw={500} size="sm" lineClamp={1}>
                                {transaction.name}
                              </Text>
                              <Group gap="xs" mt={6}>
                                <Badge variant="light" color="gray" size="xs">
                                  {transaction.sub_text}
                                </Badge>
                                <Text size="xs" c="dimmed">
                                  {dayjs(transaction.date).format(
                                    "Do MMM, YYYY",
                                  )}
                                </Text>
                              </Group>
                            </Box>
                          </Group>
                        </Grid.Col>
                        <Grid.Col span={{ base: 6, xs: 3 }}>
                          <Stack gap={6}>
                            <Text size="xs">Units: {transaction.units}</Text>
                            <Text size="xs">
                              NAV: <CurrencyFormatter value={transaction.nav} />
                            </Text>
                          </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ base: 6, xs: 3 }}>
                          <Stack gap={4} ta="right" style={{ flexShrink: 0 }}>
                            <Text fw={500} size="sm">
                              <CurrencyFormatter
                                value={transaction.amount}
                                prefix={transaction.is_purchase ? "+" : "-"}
                              />
                            </Text>
                            <Text size="xs" c="dimmed" tt="capitalize">
                              {transaction.transaction_type}
                            </Text>
                          </Stack>
                        </Grid.Col>
                      </Grid>
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
