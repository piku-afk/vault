import { Grid } from "@mantine/core";
import { Building2, CalendarClock, ReceiptIndianRupee } from "lucide-react";
import { Suspense } from "react";
import { Await } from "react-router";

import type { getQuickStats } from "#/utils/getOverviewStats.server";

import { Section } from "../section";
import { StatCard, StatCardSkeleton } from "./stat-card";

export function QuickStatsGrid(props: {
  quickStats: ReturnType<typeof getQuickStats>;
}) {
  return (
    <Section title="Quick Stats">
      <Grid grow gutter="lg">
        <Suspense
          fallback={Array.from(Array(3).keys()).map((item) => (
            <Grid.Col span={{ base: 6, xs: 4 }} key={item}>
              <StatCardSkeleton />
            </Grid.Col>
          ))}
        >
          <Await resolve={props.quickStats}>
            {(quickStats) => {
              const stats = [
                {
                  icon: Building2,
                  value: quickStats.totalSchemes,
                  label: "Total Schemes",
                },
                {
                  icon: CalendarClock,
                  value: quickStats.daysTillNextTransaction,
                  label: "Days Till Next SIP",
                },
                {
                  icon: ReceiptIndianRupee,
                  value: quickStats.monthlySip,
                  label: "Monthly SIP",
                  isCurrency: true,
                },
              ];
              return stats.map((stat) => (
                <Grid.Col span={{ base: 6, xs: 4 }} key={stat.label}>
                  <StatCard {...stat} />
                </Grid.Col>
              ));
            }}
          </Await>
        </Suspense>
      </Grid>
    </Section>
  );
}
