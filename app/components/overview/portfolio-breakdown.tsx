import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/section";
import { useOverviewLoaderData } from "#/routes/private/overview";

import { AllocationChart } from "./allocation-chart";
import {
  MonthlyPerformers,
  MonthlyPerformersSkeleton,
} from "./monthly-performance";

export function PortfolioBreakdown() {
  const loaderData = useOverviewLoaderData();

  return (
    <Section title="Portfolio Breakdown">
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
