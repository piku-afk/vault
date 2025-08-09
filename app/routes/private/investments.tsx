import {
  Badge,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { Section } from "#/components/section";
import {
  getInvestmentData,
  getInvestmentDataBySavingsCategory,
} from "#/utils/getInvestment.server";

import type { Route } from "./+types/investments";

export async function loader() {
  return {
    funds: await getInvestmentData(),
    fundsByCategory: await getInvestmentDataBySavingsCategory(),
  };
}

export default function Investments({ loaderData }: Route.ComponentProps) {
  const { funds, fundsByCategory } = loaderData;

  return (
    <Stack gap="xl">
      {/* Funds by Category - Card Layout */}
      <Section title="Funds by Savings Category">
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
          {fundsByCategory.map((category) => {
            const schemes = category.schemes || [];
            const categoryTotals = schemes.reduce(
              (
                acc: { invested: number; current: number; returns: number },
                scheme: {
                  invested?: number;
                  current?: number;
                  returns?: number;
                },
              ) => ({
                invested: acc.invested + (scheme.invested || 0),
                current: acc.current + (scheme.current || 0),
                returns: acc.returns + (scheme.returns || 0),
              }),
              { invested: 0, current: 0, returns: 0 },
            );

            const categoryReturnsPercentage =
              categoryTotals.invested > 0
                ? (categoryTotals.returns / categoryTotals.invested) * 100
                : 0;

            const categoryIsPositive = categoryTotals.returns > 0;
            const progressValue =
              categoryTotals.invested > 0
                ? Math.min(
                    (categoryTotals.current / categoryTotals.invested) * 100,
                    150,
                  )
                : 0;

            return (
              <Card key={category.name} withBorder radius="lg" p="lg">
                <Stack gap="md">
                  {/* Category Header */}
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Title order={3} fw={600}>
                        {category.name}
                      </Title>
                      <Text size="sm" c="dimmed">
                        {schemes.length} schemes
                      </Text>
                    </div>
                    <Badge
                      variant="light"
                      color={categoryIsPositive ? "teal" : "red"}
                      size="lg"
                    >
                      <NumberFormatter
                        value={Math.abs(categoryReturnsPercentage)}
                        suffix="%"
                        decimalScale={1}
                        prefix={categoryIsPositive ? "+" : "-"}
                      />
                    </Badge>
                  </Group>

                  {/* Progress Bar */}
                  <Progress
                    value={progressValue}
                    color={categoryIsPositive ? "teal" : "red"}
                    size="sm"
                    radius="xl"
                  />

                  {/* Category Summary */}
                  <SimpleGrid cols={3} spacing="xs">
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Invested
                      </Text>
                      <Text fw={600} size="sm">
                        <CurrencyFormatter value={categoryTotals.invested} />
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Current
                      </Text>
                      <Text fw={600} size="sm">
                        <CurrencyFormatter value={categoryTotals.current} />
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Returns
                      </Text>
                      <Text
                        fw={600}
                        size="sm"
                        c={categoryIsPositive ? "teal.7" : "red.7"}
                      >
                        <CurrencyFormatter
                          value={Math.abs(categoryTotals.returns)}
                          prefix={categoryIsPositive ? "+₹" : "-₹"}
                        />
                      </Text>
                    </div>
                  </SimpleGrid>

                  <Divider />

                  {/* Schemes List */}
                  <Stack gap="sm">
                    <Text fw={500} size="sm" c="dimmed">
                      Individual Schemes
                    </Text>
                    {schemes.map(
                      (scheme: {
                        name: string;
                        invested?: number;
                        current?: number;
                        returns?: number;
                        returns_percentage?: number;
                      }) => {
                        const schemeIsPositive = (scheme.returns || 0) > 0;
                        return (
                          <Card
                            key={scheme.name}
                            withBorder
                            radius="md"
                            p="sm"
                            bg="gray.0"
                          >
                            <Group justify="space-between" align="flex-start">
                              <div style={{ flex: 1 }}>
                                <Text fw={500} size="sm" lineClamp={2}>
                                  {scheme.name}
                                </Text>
                                <Group gap="md" mt="xs">
                                  <Text size="xs" c="dimmed">
                                    Invested:{" "}
                                    <CurrencyFormatter
                                      value={scheme.invested || 0}
                                    />
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    Current:{" "}
                                    <CurrencyFormatter
                                      value={scheme.current || 0}
                                    />
                                  </Text>
                                </Group>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <Text
                                  fw={600}
                                  size="sm"
                                  c={schemeIsPositive ? "teal.7" : "red.7"}
                                >
                                  <CurrencyFormatter
                                    value={scheme.returns || 0}
                                  />
                                </Text>
                                <Text
                                  size="xs"
                                  c={schemeIsPositive ? "teal.6" : "red.6"}
                                >
                                  <NumberFormatter
                                    value={scheme.returns_percentage || 0}
                                    suffix="%"
                                    decimalScale={1}
                                    prefix={schemeIsPositive ? "+" : ""}
                                  />
                                </Text>
                              </div>
                            </Group>
                          </Card>
                        );
                      },
                    )}
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Section>

      <Divider />

      {/* All Funds Table */}
      <Section title="All Funds">
        <Table.ScrollContainer minWidth="48em">
          <Table withTableBorder>
            <Table.Thead bg="violet.0">
              <Table.Tr>
                <Table.Th>Scheme Name</Table.Th>
                <Table.Th ta="right">Current</Table.Th>
                <Table.Th ta="right">Invested</Table.Th>
                <Table.Th ta="right">Returns</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {funds.map((fund) => (
                <Table.Tr key={fund.scheme_name}>
                  <Table.Td fw={500}>{fund.scheme_name}</Table.Td>
                  <Table.Td ta="right">
                    <CurrencyFormatter value={fund.current} />
                  </Table.Td>
                  <Table.Td ta="right">
                    <CurrencyFormatter value={fund.invested} />
                  </Table.Td>
                  <Table.Td
                    ta="right"
                    fw={600}
                    c={fund.returns > 0 ? "teal" : "red"}
                  >
                    <CurrencyFormatter value={fund.returns} />
                    &nbsp;(
                    <NumberFormatter
                      value={fund.returns_percentage}
                      suffix="%"
                      decimalScale={2}
                    />
                    )
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Section>
    </Stack>
  );
}
