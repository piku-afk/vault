import { Divider, Stack } from "@mantine/core";
import { Outlet, useLoaderData } from "react-router";

import { AnalysisSection } from "#/components/sections/analysis-section";
import { GoalsSection } from "#/components/sections/goals-section";
import { PerformanceSection } from "#/components/sections/performance-section";
import { StatsSection } from "#/components/sections/stats-section";
import { SummarySection } from "#/components/sections/summary-section";
import { TransactionHistorySection } from "#/components/sections/transaction-history-section";
import { getOverview } from "#/database/get-overview.server";

import type { Route } from "./+types/overview";

export async function loader() {
  return getOverview();
}

export function useOverviewLoaderData() {
  return useLoaderData<typeof loader>();
}

let count = 0;

export default function Overview({ loaderData }: Route.ComponentProps) {
  count++;
  console.log(count);

  return (
    <Stack mt="md" gap="xl">
      <Outlet />

      <SummarySection title="Portfolio Summary" data={loaderData.summary} />
      <Divider />

      <StatsSection title="Portfolio Stats" data={loaderData.stats} />
      <Divider />

      <AnalysisSection title="Portfolio Analysis" data={loaderData.analysis} />
      <Divider />

      <PerformanceSection
        title="Category Performance"
        data={loaderData.performanceData}
      />
      <Divider />

      <GoalsSection title="Investment Goals" data={loaderData.goals} />
      <Divider />

      <TransactionHistorySection
        title="Transaction History"
        data={loaderData.recentTransactions}
      />
    </Stack>
  );
}
