import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/section";
import { useOverviewLoaderData } from "#/routes/private/overview";
import {
  getReturnsColor,
  getReturnsPrefix,
  isPositiveReturns,
} from "#/utils/financialHelpers";

import { MetricCard, MetricCardSkeleton } from "./metric-card";

export function PortfolioSummary() {
  const loaderData = useOverviewLoaderData();

  return (
    <Section title="Portfolio Summary">
      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(3).keys()).map((item) => (
            <MetricCardSkeleton key={item} />
          ))}
        >
          <Await resolve={loaderData.summary}>
            {(summary) => {
              const isPositiveReturn = isPositiveReturns(summary.net_returns);
              const returnsColor = getReturnsColor(summary.net_returns);
              const returnsPrefix = getReturnsPrefix(summary.net_returns);

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
                  badgeColor: returnsColor,
                  value: summary.net_returns,
                  description: "",
                  prefix: summary.net_returns > 0 ? returnsPrefix : undefined,
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
