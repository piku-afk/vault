import { NumberFormatter, SimpleGrid, Text } from "@mantine/core";
import { Fragment, Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/shared/section";
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
                  label: "Net Current",
                  badgeText: "Total",
                  badgeColor: "gray",
                  value: summary.net_current,
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
                  label: "Net Returns",
                  badgeText: isPositiveReturn ? "Profit" : "Loss",
                  badgeColor: returnsColor,
                  value: summary.net_returns,
                  prefix: summary.net_returns > 0 ? returnsPrefix : undefined,
                  description: (
                    <Fragment>
                      <Text component="span" size="xs" c={returnsColor}>
                        <NumberFormatter
                          value={Math.abs(summary.net_returns_percentage)}
                          suffix="%"
                          decimalScale={2}
                          prefix={returnsPrefix}
                        />
                      </Text>
                      &nbsp;return rate
                    </Fragment>
                  ),
                },
                // {
                //   label: "XIRR",
                //   badgeText: isPositiveReturn ? "Profit" : "Loss",
                //   badgeColor: returnsColor,
                //   value: summary.xirr,
                //   description: "Compound Annual Growth Rate",
                // },
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
