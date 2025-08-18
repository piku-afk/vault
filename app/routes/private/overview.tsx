import { Divider, Stack } from "@mantine/core";
import { Outlet, useLoaderData } from "react-router";

import { AnalysisSection } from "#/components/sections/analysis-section";
import { GoalsSection } from "#/components/sections/goals-section";
import { PerformanceSection } from "#/components/sections/performance-section";
import { StatsSection } from "#/components/sections/stats-section";
import { SummarySection } from "#/components/sections/summary-section";
import { TransactionHistorySection } from "#/components/sections/transaction-history-section";
import { getGoalProgress } from "#/database/getGoals.server";
import {
  getQuickStats,
  getRecentTransactions,
} from "#/database/getOverviewStats.server";
import {
  getBestAndWorstPerformer,
  getCategoryAllocation,
  getPositiveCounts,
} from "#/database/getPortfolioAnalytics.server";
import { getSavingsCategorySummary } from "#/database/getSummaryBySavingsCategory.server";
import { getSummaryData } from "#/database/getSummaryData.server";

import type { Route } from "./+types/overview";

export async function loader() {
  return {
    summary: getSummaryData(),
    savingsCategorySummary: getSavingsCategorySummary(),
    recentTransactions: getRecentTransactions(),
    quickStats: getQuickStats(),
    goalProgress: getGoalProgress(),
    categoryAllocation: getCategoryAllocation(),
    bestAndWorstPerformer: getBestAndWorstPerformer(),
    positiveCounts: getPositiveCounts(),
  };
}

export function useOverviewLoaderData() {
  return useLoaderData<typeof loader>();
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const {
    summary,
    quickStats,
    categoryAllocation,
    bestAndWorstPerformer,
    positiveCounts,
    savingsCategorySummary,
    goalProgress,
    recentTransactions,
  } = loaderData;

  return (
    <Stack mt="md" gap="xl">
      <Outlet />

      <SummarySection title="Portfolio Summary" data={summary} />
      <Divider />

      <StatsSection title="Portfolio Stats" data={quickStats} />
      <Divider />

      <AnalysisSection
        title="Portfolio Analysis"
        data={{
          categoryBreakdown: categoryAllocation,
          categoryBestPerformer: bestAndWorstPerformer.bestPerformer,
          categoryWorstPerformer: bestAndWorstPerformer.worstPerformer,
          positiveSchemeCount: positiveCounts,
        }}
      />
      <Divider />

      <PerformanceSection
        title="Category Performance"
        data={savingsCategorySummary}
      />
      <Divider />

      <GoalsSection title="Investment Goals" data={goalProgress} />
      <Divider />

      <TransactionHistorySection
        title="Transaction History"
        data={recentTransactions}
      />
    </Stack>
  );
}
