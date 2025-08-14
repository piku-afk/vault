import { Divider, Stack } from "@mantine/core";
import { useLoaderData } from "react-router";

import { CategoryPerformance } from "#/components/overview/category-performance";
import { InvestmentGoals } from "#/components/overview/investment-goals";
import { PortfolioBreakdown } from "#/components/overview/portfolio-breakdown";
import { PortfolioOverview } from "#/components/overview/portfolio-overview";
import { QuickStatsGrid } from "#/components/overview/quick-stats-grid";
import { RecentActivity } from "#/components/overview/recent-activity";
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
  console.log("overview");
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
  return (
    <Stack mt="md" gap="xl">
      <PortfolioOverview />
      <Divider />

      <InvestmentGoals />
      <Divider />

      <QuickStatsGrid />
      <Divider />

      <CategoryPerformance />
      <Divider />

      <PortfolioBreakdown />
      <Divider />

      <RecentActivity />
    </Stack>
  );
}
