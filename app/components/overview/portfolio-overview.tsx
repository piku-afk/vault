import { SimpleGrid } from "@mantine/core";

import { Section } from "#/components/section";

import { MetricCard } from "./metric-card";

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
