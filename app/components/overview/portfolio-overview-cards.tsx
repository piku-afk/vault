import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";

import { Section } from "../section";

interface PortfolioOverviewCardsProps {
  summary: {
    net_worth: number;
    net_invested: number;
    net_returns: number;
    net_returns_percentage: number;
  };
}

export function PortfolioOverviewCards({
  summary,
}: PortfolioOverviewCardsProps) {
  const totalReturn = summary.net_returns;
  const isPositiveReturn = totalReturn > 0;

  return (
    <Section title="Portfolio Overview">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
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
              <CurrencyFormatter value={summary.net_worth} />
            </Title>
            <Text size="xs" c="violet.6">
              Current portfolio value
            </Text>
          </Stack>
        </Card>
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
              <CurrencyFormatter value={summary.net_invested} />
            </Title>
            <Text size="xs" c="blue.6">
              Total amount invested
            </Text>
          </Stack>
        </Card>
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
            <Title order={2} c={isPositiveReturn ? "teal.9" : "red.9"} fw={700}>
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
                  value={Math.abs(summary.net_returns_percentage)}
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
  );
}
