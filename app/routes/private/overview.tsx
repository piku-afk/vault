import { Divider, Stack } from "@mantine/core";

import { CategoryPerformance } from "#/components/overview/category-performance";
import { InvestmentGoals } from "#/components/overview/investment-goals";
import { PortfolioDiversification } from "#/components/overview/portfolio-diversification";
import { PortfolioOverviewCards } from "#/components/overview/portfolio-overview-cards";
import { QuickStatsGrid } from "#/components/overview/quick-stats-grid";
import { RecentActivity } from "#/components/overview/recent-activity";
import { Section } from "#/components/section";
import { getGoalProgress } from "#/utils/getGoals.server";
import {
  getQuickStats,
  getRecentTransactions,
} from "#/utils/getOverviewStats.server";
import {
  getBestPerformer,
  getPortfolioDiversification,
} from "#/utils/getPortfolioAnalytics.server";
import { getSummaryBySavingsCategory } from "#/utils/getSummaryBySavingsCategory.server";
import { getSummaryData } from "#/utils/getSummaryData.server";

import type { Route } from "./+types/overview";

export async function loader() {
  const summary = await getSummaryData();
  const summaryBySavingsCategory = await getSummaryBySavingsCategory();
  const goalProgress = await getGoalProgress(summary.net_worth);
  const recentTransactions = await getRecentTransactions(8);
  const quickStats = await getQuickStats();
  const portfolioDiversification = await getPortfolioDiversification();
  const bestPerformer = await getBestPerformer();

  return {
    summary,
    summaryBySavingsCategory,
    goalProgress,
    recentTransactions,
    quickStats,
    portfolioDiversification,
    bestPerformer,
  };
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const {
    summary,
    summaryBySavingsCategory,
    goalProgress,
    recentTransactions,
    quickStats,
    portfolioDiversification,
    bestPerformer,
  } = loaderData;

  return (
    <Stack mt="md" gap="xl">
      <PortfolioOverviewCards summary={summary} />

      <Section title="Quick Stats">
        <QuickStatsGrid quickStats={quickStats} bestPerformer={bestPerformer} />
      </Section>

      {goalProgress.length > 0 && (
        <>
          <Section title="Investment Goals">
            <InvestmentGoals
              goalProgress={goalProgress}
              netWorth={summary.net_worth}
            />
          </Section>
          <Divider />
        </>
      )}

      <Section title="Recent Activity">
        <RecentActivity transactions={recentTransactions} />
      </Section>

      <Section title="Portfolio Diversification">
        <PortfolioDiversification
          portfolioDiversification={portfolioDiversification}
        />
      </Section>

      <Divider />

      <Section title="Category Performance">
        <CategoryPerformance
          summaryBySavingsCategory={summaryBySavingsCategory}
        />
      </Section>
    </Stack>
  );
}
