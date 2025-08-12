import { Divider, Stack } from "@mantine/core";

import { CategoryPerformance } from "#/components/overview/category-performance";
import { InvestmentGoals } from "#/components/overview/investment-goals";
import { PortfolioDiversification } from "#/components/overview/portfolio-diversification";
import { PortfolioOverview } from "#/components/overview/portfolio-overview";
import { QuickStatsGrid } from "#/components/overview/quick-stats-grid";
import { RecentActivity } from "#/components/overview/recent-activity";
import { getGoalProgress } from "#/utils/getGoals.server";
import {
  getQuickStats,
  getRecentTransactions,
} from "#/utils/getOverviewStats.server";
import {
  getBestAndWorstPerformer,
  getCategoryAllocation,
} from "#/utils/getPortfolioAnalytics.server";
import { getSavingsCategorySummary } from "#/utils/getSummaryBySavingsCategory.server";
import { getSummaryData } from "#/utils/getSummaryData.server";

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
  };
}

export default function Overview(props: Route.ComponentProps) {
  const {
    summary,
    savingsCategorySummary,
    recentTransactions,
    goalProgress,
    quickStats,
    categoryAllocation,
    bestAndWorstPerformer,
  } = props.loaderData;

  return (
    <Stack mt="md" gap="xl">
      <PortfolioOverview summary={summary} />
      <Divider />

      <InvestmentGoals goalProgress={goalProgress} />
      <Divider />

      <QuickStatsGrid quickStats={quickStats} />
      <Divider />

      <CategoryPerformance savingsCategorySummary={savingsCategorySummary} />
      <Divider />

      <PortfolioDiversification
        categoryAllocation={categoryAllocation}
        bestAndWorstPerformer={bestAndWorstPerformer}
      />
      <Divider />

      <RecentActivity transactions={recentTransactions} />
    </Stack>
  );
}
