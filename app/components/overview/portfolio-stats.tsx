import {
  Card,
  Group,
  getThemeColor,
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
import { Building2, CalendarClock, ReceiptIndianRupee } from "lucide-react";
import { Suspense, useState } from "react";
import { Await } from "react-router";

import { Section } from "#/components/shared/section";
import { useOverviewLoaderData } from "#/routes/private/overview";

import { CurrencyFormatter } from "../currency-formatter";

export function PortfolioStats() {
  const theme = useMantineTheme();
  const loaderData = useOverviewLoaderData();
  const [stackHeight, setStackHeight] = useState(0);

  return (
    <Section title="Portfolio Stats">
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="lg">
        <Stack ref={(ref) => setStackHeight(ref?.offsetHeight ?? 0)} gap="lg">
          <Suspense
            fallback={Array.from(Array(3).keys()).map((item) => (
              <Card withBorder key={item}>
                <Group gap="sm" align="flex-start">
                  <Skeleton height={40} width={40} mt={2} />
                  <Stack gap={14}>
                    <Skeleton height={25} width={80} />
                    <Skeleton height={12} width={100} />
                  </Stack>
                </Group>
              </Card>
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
                  <Card withBorder key={stat.label}>
                    <Group gap="sm" align="flex-start">
                      <ThemeIcon mt={2} variant="default" size="lg">
                        <stat.icon size={18} />
                      </ThemeIcon>
                      <Stack gap={2}>
                        <Text size="xl" fw={500}>
                          {stat.isCurrency ? (
                            <CurrencyFormatter value={stat.value} />
                          ) : (
                            stat.value
                          )}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {stat.label}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                ));
              }}
            </Await>
          </Suspense>
        </Stack>
        <Card withBorder h={stackHeight} p={0}>
          <Suspense
            fallback={
              <Skeleton my="md" mx="auto" circle height={stackHeight - 56} />
            }
          >
            <Await resolve={loaderData.savingsCategorySummary}>
              {(categories) => {
                const data: Partial<ComputedDatum<DefaultRawDatum>>[] =
                  categories.map((category) => ({
                    id: category.name,
                    label: category.name,
                    value: Number(category.monthly_sip),
                    color: getThemeColor(`${category.color}.5`, theme),
                  }));

                return (
                  <ResponsivePie
                    animate
                    margin={{ top: 28, bottom: 40 }}
                    innerRadius={0.6}
                    data={data}
                    padAngle={1.2}
                    colors={{ datum: "data.color" }}
                    cornerRadius={6}
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
            SIP Breakdown
          </Text>
        </Card>
      </SimpleGrid>
    </Section>
  );
}
