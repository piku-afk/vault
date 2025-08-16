import {
  Card,
  getThemeColor,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  type ComputedDatum,
  type DefaultRawDatum,
  ResponsivePie,
} from "@nivo/pie";
import { Suspense, useState } from "react";
import { Await } from "react-router";

import { Section } from "#/components/shared/section";
import { useOverviewLoaderData } from "#/routes/private/overview";

import {
  MonthlyPerformers,
  MonthlyPerformersSkeleton,
} from "./monthly-performance";
import {
  PerformanceCountCardSkeleton,
  PortfolioHealth,
} from "./portfolio-health";

export function PortfolioAnalysis() {
  const theme = useMantineTheme();
  const [stackHeight, setStackHeight] = useState(0);
  const { categoryAllocation } = useOverviewLoaderData();

  return (
    <Section title="Portfolio Analysis">
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="lg">
        <Card withBorder h={stackHeight ?? "auto"} p={0}>
          <Suspense
            fallback={
              <Skeleton
                circle
                my="lg"
                mx="auto"
                height={stackHeight - 60}
                width="100%"
              />
            }
          >
            <Await resolve={categoryAllocation}>
              {(categoryAllocation) => {
                const data: Partial<ComputedDatum<DefaultRawDatum>>[] =
                  categoryAllocation.map((item) => ({
                    id: item.name,
                    value: Math.round(item.allocation_percentage),
                    label: item.name,
                    color: getThemeColor(`${item.color}.5`, theme),
                  }));

                return (
                  <ResponsivePie
                    animate
                    margin={{ top: 20, bottom: 60, left: 36 }}
                    innerRadius={0.6}
                    data={data}
                    padAngle={1.2}
                    colors={{ datum: "data.color" }}
                    cornerRadius={6}
                    arcLabel={(d) => `${d.formattedValue}%`}
                    arcLinkLabelsTextColor={getThemeColor("black", theme)}
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsTextColor={getThemeColor("black", theme)}
                    tooltip={() => null}
                  />
                );
              }}
            </Await>
          </Suspense>
          <Text
            size="xs"
            c="dimmed"
            ta="center"
            pos="absolute"
            bottom={8}
            left="50%"
            style={{ transform: "translateX(-50%)" }}
          >
            Portfolio Breakdown
          </Text>
        </Card>

        <Stack gap="lg" ref={(ref) => setStackHeight(ref?.offsetHeight ?? 0)}>
          <Suspense fallback={<MonthlyPerformersSkeleton />}>
            <MonthlyPerformers />
          </Suspense>

          <Suspense fallback={<PerformanceCountCardSkeleton />}>
            <PortfolioHealth />
          </Suspense>
        </Stack>
      </SimpleGrid>
    </Section>
  );
}
