import { Divider, Stack } from "@mantine/core";
import { Outlet, useLoaderData } from "react-router";

import { CategoryPerformance } from "#/components/overview/category-performance";
import { InvestmentGoals } from "#/components/overview/investment-goals";
import { PortfolioAnalysis } from "#/components/overview/portfolio-analysis";
import { PortfolioStats } from "#/components/overview/portfolio-stats";
import { PortfolioSummary } from "#/components/overview/portfolio-summary";
import { TransactionHistory } from "#/components/overview/transaction-history";
import { PerformanceSection } from "#/components/sections/performance-section";
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

export default function Overview() {
  const { savingsCategorySummary } = useOverviewLoaderData();

  return (
    <Stack mt="md" gap="xl">
      <PortfolioSummary />
      <Divider />

      <PortfolioStats />
      <Divider />

      <PortfolioAnalysis />
      <Divider />

      <PerformanceSection
        title="Category Performance"
        data={savingsCategorySummary}
      />
      {/* <CategoryPerformance /> */}
      <Divider />

      <InvestmentGoals />
      <Divider />
      <Outlet />

      <TransactionHistory />
    </Stack>
  );
}
