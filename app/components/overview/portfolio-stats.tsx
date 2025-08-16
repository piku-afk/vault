import { Card, SimpleGrid, Stack, Text } from "@mantine/core";
import { Building2, CalendarClock, ReceiptIndianRupee } from "lucide-react";
import { Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/shared/section";
import { useOverviewLoaderData } from "#/routes/private/overview";

import { StatCard, StatCardSkeleton } from "./stat-card";

export function PortfolioStats() {
  const loaderData = useOverviewLoaderData();

  return (
    <Section title="Portfolio Stats">
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="lg">
        <Stack gap="lg">
          <Suspense
            fallback={Array.from(Array(3).keys()).map((item) => (
              <StatCardSkeleton key={item} />
            ))}
          >
            <Await resolve={loaderData.quickStats}>
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
                  <StatCard key={stat.label} {...stat} />
                ));
              }}
            </Await>
          </Suspense>
        </Stack>
        <Card withBorder>
          <Text size="xs" c="dimmed" ta="center">
            SIP Breakdown
          </Text>
        </Card>
      </SimpleGrid>
    </Section>
  );
}
