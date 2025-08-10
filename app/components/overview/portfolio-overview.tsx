import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/section";
import type { getSummaryData } from "#/utils/getSummaryData.server";

import { MetricCard, MetricCardSkeleton } from "./metric-card";

export function PortfolioOverview(props: {
  summary: ReturnType<typeof getSummaryData>;
}) {
  return (
    <Section title="Portfolio Overview">
      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(3).keys()).map((item) => (
            <MetricCardSkeleton key={item} />
          ))}
        >
          <Await resolve={props.summary}>
            {(summary) => {
              const isPositiveReturn = summary.net_returns > 0;
              const metrics = [
                {
                  label: "Net Worth",
                  badgeText: "Total",
                  badgeColor: "gray",
                  value: summary.net_worth,
                  description: "Current portfolio value",
                },
                {
                  label: "Net Invested",
                  badgeText: "Principal",
                  badgeColor: "gray",
                  value: summary.net_invested,
                  description: "Total amount invested",
                },
                {
                  label: "Returns",
                  badgeText: isPositiveReturn ? "Profit" : "Loss",
                  badgeColor: isPositiveReturn ? "teal" : "red",
                  value: summary.net_returns,
                  description: "",
                  prefix: summary.net_returns > 0 ? "+" : undefined,
                  percentageValue: summary.net_returns_percentage,
                },
              ];

              return metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ));
            }}
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
