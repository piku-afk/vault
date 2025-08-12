import { SimpleGrid } from "@mantine/core";
import { Await } from "react-router";

import { Section } from "#/components/section";
import type {
  getBestAndWorstPerformer,
  getCategoryAllocation,
} from "#/utils/getPortfolioAnalytics.server";

import { AllocationChart } from "./allocation-chart";
import {
  MonthlyPerformers,
  MonthlyPerformersSkeleton,
} from "./monthly-performance";
import { Suspense } from "react";
import { useOverviewLoaderData } from "#/routes/private/overview";

export function PortfolioDiversification() {
  const loaderData = useOverviewLoaderData();

  return (
    <Section title="Portfolio Diversification">
      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing="lg"
        style={{ alignItems: "flex-start" }}
      >
        <Await resolve={loaderData.categoryAllocation}>
          {(categoryAllocation) => (
            <AllocationChart categoryAllocation={categoryAllocation} />
          )}
        </Await>

        <Suspense fallback={<MonthlyPerformersSkeleton />}>
          <MonthlyPerformers />
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
