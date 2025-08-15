import { SimpleGrid, Stack } from "@mantine/core";
import { Suspense } from "react";

import { Section } from "#/components/section";

import { AllocationChart, AllocationChartSkeleton } from "./allocation-chart";
import {
  MonthlyPerformers,
  MonthlyPerformersSkeleton,
} from "./monthly-performance";
import {
  PerformanceCountCardSkeleton,
  PortfolioHealth,
} from "./portfolio-health";

export function PortfolioAnalysis() {
  return (
    <Section title="Portfolio Analysis">
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="lg">
        <Suspense fallback={<AllocationChartSkeleton />}>
          <AllocationChart />
        </Suspense>

        <Stack gap="lg">
          <Suspense fallback={<MonthlyPerformersSkeleton />}>
            <MonthlyPerformers />
          </Suspense>

          <Suspense fallback={<PerformanceCountCardSkeleton />}>
            <PortfolioHealth />
          </Suspense>
        </Stack>
      </SimpleGrid>
    </Section>
  );
}
