import { Divider, Stack } from "@mantine/core";
import { Outlet } from "react-router";

import { AnalysisSection } from "#/components/sections/analysis-section";
import { GoalsSection } from "#/components/sections/goals-section";
import { PerformanceSection } from "#/components/sections/performance-section";
import { StatsSection } from "#/components/sections/stats-section";
import { SummarySection } from "#/components/sections/summary-section";
import { TransactionHistorySection } from "#/components/sections/transaction-history-section";
import { getGoalsProgress } from "#/database/get-goals-progress";
import { getOverview } from "#/database/get-overview.server";
import { getXIRR } from "#/database/get-xirr.server";
import { requireAuth } from "#/middlewares/requireAuth";

import type { Route } from "./+types/overview";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  return {
    ...getOverview(),
    goalsProgress: getGoalsProgress(),
    xirr: getXIRR(),
  };
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  return (
    <Stack mt="md" gap="xl">
      <title>Vault - Overview</title>
      <Outlet />

      <SummarySection
        title="Portfolio Summary"
        data={loaderData.summary}
        xirr={loaderData.xirr}
      />
      <Divider />

      <StatsSection title="Portfolio Stats" data={loaderData.stats} />
      <Divider />

      <AnalysisSection title="Portfolio Analysis" data={loaderData.analysis} />
      <Divider />

      <PerformanceSection
        title="Category Performance"
        data={loaderData.performanceData}
        xirr={loaderData.xirr}
      />
      <Divider />

      <GoalsSection title="Investment Goals" data={loaderData.goalsProgress} />
      <Divider />

      <TransactionHistorySection
        title="Transaction History"
        data={loaderData.recentTransactions}
      />
    </Stack>
  );
}
