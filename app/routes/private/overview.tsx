import { Divider, Stack } from "@mantine/core";

import { CategoryPerformance } from "#/components/overview/category-performance";
import { InvestmentGoals } from "#/components/overview/investment-goals";
import { PortfolioDiversification } from "#/components/overview/portfolio-diversification";
import { PortfolioOverview } from "#/components/overview/portfolio-overview";
import { QuickStatsGrid } from "#/components/overview/quick-stats-grid";
import { RecentActivity } from "#/components/overview/recent-activity";
import { Section } from "#/components/section";
// import { getGoalProgress } from "#/utils/getGoals.server";
import {
  getQuickStats,
  getRecentTransactions,
} from "#/utils/getOverviewStats.server";
// import {
//     getPortfolioDiversification,
// } from "#/utils/getPortfolioAnalytics.server";
import { getSummaryBySavingsCategory } from "#/utils/getSummaryBySavingsCategory.server";
import { getSummaryData } from "#/utils/getSummaryData.server";

import type { Route } from "./+types/overview";

export async function loader() {
  // const summary = await getSummaryData();
  // const summaryBySavingsCategory = await getSummaryBySavingsCategory();
  // const recentTransactions = await getRecentTransactions();
  // const goalProgress = await getGoalProgress(summary.net_worth);
  // const portfolioDiversification = await getPortfolioDiversification();

  return {
    summary: getSummaryData(),
    summaryBySavingsCategory: getSummaryBySavingsCategory(),
    recentTransactions: getRecentTransactions(),
    quickStats: getQuickStats(),
    // // goalProgress,
    // portfolioDiversification,
  };
}

export default function Overview(props: Route.ComponentProps) {
  const {
    summary,
    summaryBySavingsCategory,
    recentTransactions,
    // // goalProgress,
    quickStats,
    // portfolioDiversification,
  } = props.loaderData;

  return (
    <Stack mt="md" gap="xl">
      <PortfolioOverview summary={summary} />
      <Divider />
      <Section title="Quick Stats">
        <QuickStatsGrid quickStats={quickStats} />
      </Section>
      <Divider />
      <CategoryPerformance
        summaryBySavingsCategory={summaryBySavingsCategory}
      />
      <Divider />
      <RecentActivity transactions={recentTransactions} />

      {/* 

    

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

      

      <Section title="Portfolio Diversification">
        <PortfolioDiversification
          portfolioDiversification={portfolioDiversification}
        />
      </Section>

      <Divider />

      */}
    </Stack>
  );
}
