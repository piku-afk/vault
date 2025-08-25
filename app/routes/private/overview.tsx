import { Button, Center, Divider, Skeleton, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import advanceFormat from "dayjs/plugin/advancedFormat";
import { RotateCw } from "lucide-react";
import { Suspense } from "react";
import { Await, Outlet, redirect, useFetcher } from "react-router";

import { AnalysisSection } from "#/components/sections/analysis-section";
import { GoalsSection } from "#/components/sections/goals-section";
import { PerformanceSection } from "#/components/sections/performance-section";
import { StatsSection } from "#/components/sections/stats-section";
import { SummarySection } from "#/components/sections/summary-section";
import { TransactionHistorySection } from "#/components/sections/transaction-history-section";
import { ROUTES } from "#/constants/routes";
import { getGoalsProgress } from "#/database/get-goals-progress";
import { getNavDate } from "#/database/get-nav-date";
import { getOverview } from "#/database/get-overview.server";
import { getXIRR } from "#/database/get-xirr.server";
import { requireAuth } from "#/middlewares/requireAuth";
import { createClient } from "#/utils/supabase.server";

import type { Route } from "./+types/overview";

dayjs.extend(advanceFormat);

export async function action({ request }: Route.ActionArgs) {
  await requireAuth(request);

  const { supabase } = createClient(request);
  const { error, response } = await supabase.functions.invoke("update-navs");

  if (error) {
    throw error;
  }

  if (response?.status === 200) {
    throw redirect(`${ROUTES.OVERVIEW}#portfolio-summary`);
  }

  return null;
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  return {
    ...getOverview(),
    nav_date: getNavDate(),
    goalsProgress: getGoalsProgress(),
    xirr: getXIRR(),
  };
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();

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

      <Stack component={Center} align="center" gap="xs">
        <fetcher.Form method="post" action={ROUTES.OVERVIEW}>
          <Button
            type="submit"
            size="xs"
            variant="light"
            loading={fetcher.state === "submitting"}
            leftSection={<RotateCw size={12} />}
          >
            Refresh Data
          </Button>
        </fetcher.Form>
        <Suspense fallback={<Skeleton h={12} w={100} />}>
          <Await resolve={loaderData.nav_date}>
            {(nav_date) => (
              <Text size="xs" c="dimmed">
                Updated on {dayjs(nav_date).format("Do MMM, YYYY")}
              </Text>
            )}
          </Await>
        </Suspense>
      </Stack>
    </Stack>
  );
}
