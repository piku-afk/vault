import {
  Box,
  Card,
  Group,
  getThemeColor,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  type ComputedDatum,
  type DefaultRawDatum,
  ResponsivePie,
} from "@nivo/pie";
import { Fragment, Suspense } from "react";
import { Await } from "react-router";

import type { getOverview } from "#/database/get-overview.server";

import { MonthlyPerformanceCard } from "../shared/monthly-performance-card";
import { Section } from "../shared/section";

const CHART_HEIGHT = 200;

export function AnalysisSection(props: {
  title: string;
  data: ReturnType<typeof getOverview>["analysis"];
}) {
  const theme = useMantineTheme();

  return (
    <Section title={props.title}>
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="lg">
        <Card withBorder>
          <Text mb="md" size="sm" c="dimmed" ta="center">
            {props.title.replace("Analysis", "")} Breakdown
          </Text>
          <Box mb="xl" h={CHART_HEIGHT}>
            <Suspense
              fallback={
                <Skeleton circle mx="auto" height={CHART_HEIGHT} width="100%" />
              }
            >
              <Await resolve={props.data.breakdown}>
                {(breakdown) => {
                  const data: Partial<ComputedDatum<DefaultRawDatum>>[] =
                    breakdown.map((item) => ({
                      id: item.id,
                      label: item.name,
                      value: Math.round(item.allocation_percentage),
                      color: getThemeColor(`${item.color}.5`, theme),
                    }));

                  return (
                    <ResponsivePie
                      animate
                      innerRadius={0.6}
                      data={data}
                      padAngle={1.2}
                      colors={{ datum: "data.color" }}
                      cornerRadius={6}
                      arcLabel={(d) => `${d.formattedValue}%`}
                      enableArcLinkLabels={false}
                      arcLabelsTextColor={getThemeColor("black", theme)}
                      tooltip={() => null}
                    />
                  );
                }}
              </Await>
            </Suspense>
          </Box>

          <SimpleGrid mt="auto" cols={{ base: 2, xs: 2 }} spacing="xs">
            <Await resolve={props.data.breakdown}>
              {(breakdown) => (
                <>
                  {breakdown.map((item) => (
                    <Group key={item.id} gap="xs">
                      <ThemeIcon size="xs" color={item.color} />
                      <Text size="xs">{item.name}</Text>
                    </Group>
                  ))}
                </>
              )}
            </Await>
          </SimpleGrid>
        </Card>

        <Stack gap="lg">
          <Card withBorder>
            <Text size="md">Last Month's Performance</Text>
            <Stack mt="sm" gap="xs">
              <Suspense
                fallback={Array.from(Array(2).keys()).map((item) => (
                  <Card key={item} withBorder p="xs">
                    <Stack gap={4}>
                      <Group justify="space-between" wrap="nowrap">
                        <Skeleton height={14} width="60%" />
                        <Group wrap="nowrap">
                          <Skeleton height={12} width={50} />
                          <Skeleton height={12} width={30} />
                        </Group>
                      </Group>
                      <Skeleton mt={6} height={14} width="30%" />
                    </Stack>
                  </Card>
                ))}
              >
                <Await resolve={props.data.monthlyPerformers}>
                  {([worstPerformer, bestPerformer]) => (
                    <>
                      <MonthlyPerformanceCard
                        variant="best"
                        scheme={bestPerformer}
                      />
                      <MonthlyPerformanceCard
                        variant="worst"
                        scheme={worstPerformer}
                      />
                    </>
                  )}
                </Await>
              </Suspense>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack gap={8}>
              <Text size="md">Portfolio Health</Text>
              <Box>
                <Text mb={2} size="xs" c="dimmed">
                  Positive vs Negative Returns
                </Text>

                <Suspense
                  fallback={
                    <Fragment>
                      <Group mt={6} wrap="nowrap" justify="space-between">
                        <Skeleton height={14} width="90%" />
                        <Skeleton height={14} width="10%" />
                      </Group>
                      <Skeleton mt={6} height={12} width="50%" />
                    </Fragment>
                  }
                >
                  <Await resolve={props.data.positiveCount}>
                    {(positiveSchemeCount) => {
                      const positive = positiveSchemeCount.positive;
                      const total = positiveSchemeCount.total;
                      const positivePercentage = (positive / total) * 100;

                      return (
                        <Fragment>
                          <Group wrap="nowrap">
                            <Progress
                              size="md"
                              color="teal"
                              value={positivePercentage}
                              style={{ flexGrow: 1 }}
                            />

                            <Text size="sm" style={{ flexShrink: 0 }}>
                              {positive}/{total}
                            </Text>
                          </Group>

                          <Text size="xs" c="dimmed">
                            {positivePercentage.toFixed(0)}% of schemes are
                            profitable compared to last month.
                          </Text>
                        </Fragment>
                      );
                    }}
                  </Await>
                </Suspense>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </SimpleGrid>
    </Section>
  );
}
