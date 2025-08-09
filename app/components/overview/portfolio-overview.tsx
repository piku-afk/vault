import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { Section } from "#/components/section";

function MetricCard(props: {
  label: string;
  badgeText: string;
  badgeColor: string;
  value: number;
  description: string;
  prefix?: string;
  percentageValue?: number;
}) {
  return (
    <Card withBorder>
      <Group mb="sm" justify="space-between" align="flex-start">
        <Text size="sm">{props.label}</Text>
        <Badge variant="light" size="sm" color={props.badgeColor}>
          {props.badgeText}
        </Badge>
      </Group>
      <Title order={2} fw={500}>
        <CurrencyFormatter value={props.value} prefix={props.prefix} />
      </Title>
      <Group mt="xs" gap="xs" align="center">
        <Text size="xs" c="dimmed">
          {props.percentageValue ? (
            <>
              <Text
                component="span"
                size="xs"
                c={props.value > 0 ? "teal" : "red"}
              >
                <NumberFormatter
                  value={Math.abs(props.percentageValue)}
                  suffix="%"
                  decimalScale={2}
                  prefix={props.value > 0 ? "+" : "-"}
                />
              </Text>
              &nbsp;return rate
            </>
          ) : (
            props.description
          )}
        </Text>
      </Group>
    </Card>
  );
}

export function PortfolioOverview(props: {
  summary: {
    net_worth: number;
    net_invested: number;
    net_returns: number;
    net_returns_percentage: number;
  };
}) {
  const isPositiveReturn = props.summary.net_returns > 0;

  const metrics = [
    {
      label: "Net Worth",
      badgeText: "Total",
      badgeColor: "gray",
      value: props.summary.net_worth,
      description: "Current portfolio value",
    },
    {
      label: "Net Invested",
      badgeText: "Principal",
      badgeColor: "gray",
      value: props.summary.net_invested,
      description: "Total amount invested",
    },
    {
      label: "Returns",
      badgeText: isPositiveReturn ? "Profit" : "Loss",
      badgeColor: isPositiveReturn ? "teal" : "red",
      value: props.summary.net_returns,
      description: "",
      prefix: props.summary.net_returns > 0 ? "+" : undefined,
      percentageValue: props.summary.net_returns_percentage,
    },
  ];

  return (
    <Section title="Portfolio Overview">
      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="lg">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </SimpleGrid>
    </Section>
  );
}
