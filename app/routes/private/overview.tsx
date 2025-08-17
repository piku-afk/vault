import { Divider, Stack } from "@mantine/core";
import { Outlet, useLoaderData } from "react-router";

import { InvestmentGoals } from "#/components/overview/investment-goals";
import { PortfolioAnalysis } from "#/components/overview/portfolio-analysis";
import { PortfolioStats } from "#/components/overview/portfolio-stats";
import { TransactionHistory } from "#/components/overview/transaction-history";
import { PerformanceSection } from "#/components/sections/performance-section";
import { SummarySection } from "#/components/sections/summary-section";
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
  const { summary, savingsCategorySummary } = loaderData;

  return (
    <Stack mt="md" gap="xl">
      <SummarySection title="Portfolio Summary" data={summary} />
      <Divider />

      <PortfolioStats />
      <Divider />

      <PortfolioAnalysis />
      <Divider />

      <PerformanceSection
        title="Category Performance"
        data={savingsCategorySummary}
      />
      <Divider />

      <InvestmentGoals />
      <Divider />
      <Outlet />

      <TransactionHistory />
    </Stack>
  );
}
