import {
  Badge,
  Card,
  Divider,
  Group,
  NumberFormatter,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { Section } from "#/components/section";
import { getSummaryBySavingsCategory } from "#/utils/getSummaryBySavingsCategory.server";
import { getSummaryData } from "#/utils/getSummaryData.server";

import type { Route } from "./+types/overview";

export async function loader() {
  const summary = await getSummaryData();
  const summaryBySavingsCategory = await getSummaryBySavingsCategory();
  return { summary, summaryBySavingsCategory };
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const {
    summary: { net_invested, net_returns, net_returns_percentage, net_worth },
    summaryBySavingsCategory,
  } = loaderData;

  const totalReturn = net_returns;
  const isPositiveReturn = totalReturn > 0;

  return (
    <Stack gap="xl" pb="xl">
      {/* Hero Summary Cards */}
      <Section title="Portfolio Overview">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {/* Net Worth Card */}
          <Card
            withBorder
            radius="lg"
            p="xl"
            bg="gradient-to-br from-violet-50 to-violet-100"
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Text size="sm" fw={500} c="violet.7">
                  Net Worth
                </Text>
                <Badge variant="light" color="violet" size="sm">
                  Total
                </Badge>
              </Group>
              <Title order={2} c="violet.9" fw={700}>
                <CurrencyFormatter value={net_worth} />
              </Title>
              <Text size="xs" c="violet.6">
                Current portfolio value
              </Text>
            </Stack>
          </Card>

          {/* Net Invested Card */}
          <Card
            withBorder
            radius="lg"
            p="xl"
            bg="gradient-to-br from-blue-50 to-blue-100"
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Text size="sm" fw={500} c="blue.7">
                  Net Invested
                </Text>
                <Badge variant="light" color="blue" size="sm">
                  Principal
                </Badge>
              </Group>
              <Title order={2} c="blue.9" fw={700}>
                <CurrencyFormatter value={net_invested} />
              </Title>
              <Text size="xs" c="blue.6">
                Total amount invested
              </Text>
            </Stack>
          </Card>

          {/* Returns Card */}
          <Card
            withBorder
            radius="lg"
            p="xl"
            bg={
              isPositiveReturn
                ? "gradient-to-br from-teal-50 to-teal-100"
                : "gradient-to-br from-red-50 to-red-100"
            }
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Text
                  size="sm"
                  fw={500}
                  c={isPositiveReturn ? "teal.7" : "red.7"}
                >
                  Returns
                </Text>
                <Badge
                  variant="light"
                  color={isPositiveReturn ? "teal" : "red"}
                  size="sm"
                >
                  {isPositiveReturn ? "Profit" : "Loss"}
                </Badge>
              </Group>
              <Title
                order={2}
                c={isPositiveReturn ? "teal.9" : "red.9"}
                fw={700}
              >
                <CurrencyFormatter
                  value={Math.abs(totalReturn)}
                  prefix={isPositiveReturn ? "+₹" : "-₹"}
                />
              </Title>
              <Group gap="xs" align="center">
                <Text
                  size="sm"
                  fw={600}
                  c={isPositiveReturn ? "teal.7" : "red.7"}
                >
                  <NumberFormatter
                    value={Math.abs(net_returns_percentage)}
                    suffix="%"
                    decimalScale={2}
                    prefix={isPositiveReturn ? "+" : "-"}
                  />
                </Text>
                <Text size="xs" c="dimmed">
                  return rate
                </Text>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>
      </Section>

      <Divider />

      {/* Category Breakdown */}
      <Section title="Category Performance">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {summaryBySavingsCategory.map((category) => {
            const categoryReturn = category.returns;
            const categoryIsPositive = categoryReturn > 0;
            const progressValue =
              category.invested > 0
                ? Math.min((category.current / category.invested) * 100, 150)
                : 0;

            return (
              <Card key={category.name} withBorder radius="lg" p="lg">
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Text fw={600} size="lg">
                        {category.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Investment category
                      </Text>
                    </div>
                    <Badge
                      variant="light"
                      color={categoryIsPositive ? "teal" : "red"}
                      size="lg"
                    >
                      <NumberFormatter
                        value={Math.abs(category.returns_percentage)}
                        suffix="%"
                        decimalScale={1}
                        prefix={categoryIsPositive ? "+" : "-"}
                      />
                    </Badge>
                  </Group>

                  <Progress
                    value={progressValue}
                    color={categoryIsPositive ? "teal" : "red"}
                    size="sm"
                    radius="xl"
                  />

                  <SimpleGrid cols={3} spacing="xs">
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Invested
                      </Text>
                      <Text fw={600} size="sm">
                        <CurrencyFormatter value={category.invested} />
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed" mb={2}>
                        Current
                      </Text>
                      <Text fw={600} size="sm">
                        <CurrencyFormatter value={category.current} />
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
                          value={Math.abs(categoryReturn)}
                          prefix={categoryIsPositive ? "+₹" : "-₹"}
                        />
                      </Text>
                    </div>
                  </SimpleGrid>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Section>
    </Stack>
  );
}
