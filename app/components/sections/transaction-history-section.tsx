import {
  Badge,
  Box,
  Card,
  Center,
  Divider,
  Group,
  Image,
  List,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import { Suspense } from "react";
import { Await } from "react-router";

import { CurrencyFormatter } from "../currency-formatter";
import { Section } from "../shared/section";

export function TransactionHistorySection(props: {
  title: string;
  data: Promise<
    {
      id: string;
      icon: string;
      name: string;
      sub_text: string;
      date: string;
      amount: number;
      units: number;
    }[]
  >;
}) {
  return (
    <Section title={props.title}>
      <Card withBorder>
        <List spacing="md">
          <Suspense
            fallback={Array.from(Array(5).keys()).map((item, index, array) => (
              <List.Item key={item}>
                <Group align="flex-start" wrap="nowrap">
                  <Skeleton height={28} width={28} radius="md" mt={2} />
                  <Box style={{ flex: 1 }}>
                    <Skeleton height={21} width="60%" mb={6} />
                    <Group gap="xs" mt={6} wrap="wrap">
                      <Skeleton height={16} width={80} radius="sm" />
                      <Skeleton height={12} width={100} />
                    </Group>
                  </Box>
                  <Stack
                    ml="auto"
                    gap="xs"
                    align="flex-end"
                    style={{ flexShrink: 0 }}
                  >
                    <Skeleton height={16} width={80} />
                    <Skeleton height={12} width={60} />
                  </Stack>
                </Group>
                {index < array.length - 1 && <Divider mt="md" />}
              </List.Item>
            ))}
          >
            <Await resolve={props.data}>
              {(transactions) =>
                transactions.length > 0 ? (
                  transactions.map((transaction, index, array) => (
                    <List.Item key={transaction.id}>
                      <Group align="flex-start" wrap="nowrap">
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
                          <Group gap="xs" mt={6} wrap="wrap">
                            <Badge variant="light" color="gray" size="xs">
                              {transaction.sub_text}
                            </Badge>
                            <Text size="xs" c="dimmed">
                              {dayjs(transaction.date).format("DD MMM, YYYY")}
                            </Text>
                          </Group>
                        </Box>
                        <Stack
                          ml="auto"
                          gap={6}
                          ta="right"
                          style={{ flexShrink: 0 }}
                        >
                          <Text fw={500} size="sm">
                            {/* {isPurchase ? "+" : "-"} */}
                            <CurrencyFormatter value={transaction.amount} />
                          </Text>
                          <Text size="xs" c="dimmed">
                            {transaction.units} units
                          </Text>
                        </Stack>
                      </Group>
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
