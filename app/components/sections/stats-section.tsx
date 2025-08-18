import {
  ActionIcon,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import dayjs from "dayjs";
import {
  Building2,
  CalendarClock,
  Info,
  ReceiptIndianRupee,
} from "lucide-react";
import { Suspense } from "react";
import { Await, NavLink } from "react-router";

import { ROUTES } from "#/constants/routes";
import type { getOverview } from "#/database/get-overview.server";

import { CurrencyFormatter } from "../shared/currency-formatter";
import { Section } from "../shared/section";

export function StatsSection(props: {
  title: string;
  data: ReturnType<typeof getOverview>["stats"];
}) {
  return (
    <Section title={props.title}>
      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="lg">
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
          <Await resolve={props.data}>
            {(stats) => {
              return [
                {
                  icon: Building2,
                  value: stats.total_schemes,
                  label: "Total Schemes",
                },
                {
                  icon: CalendarClock,
                  value: dayjs(stats.next_sip_date).diff(dayjs(), "day") + 1,
                  label: "Days Till Next SIP",
                },
                {
                  icon: ReceiptIndianRupee,
                  value: stats.monthly_sip,
                  label: "Monthly SIP",
                  isCurrency: true,
                  action_route: ROUTES.SIP_BREAKDOWN,
                },
              ].map((stat) => (
                <Card withBorder key={stat.label}>
                  <Group gap="sm" align="flex-start">
                    <ThemeIcon mt={2} variant="default" size="lg">
                      <stat.icon size={18} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Group align="baseline" gap="xs">
                        <Text size="xl" fw={500}>
                          {stat.isCurrency ? (
                            <CurrencyFormatter value={stat.value} />
                          ) : (
                            stat.value
                          )}
                        </Text>
                        {stat.action_route && (
                          <Tooltip label="View Details">
                            <NavLink to={stat.action_route} preventScrollReset>
                              {({ isPending }) => (
                                <ActionIcon
                                  size="sm"
                                  variant="light"
                                  loading={isPending}
                                >
                                  <Info size={14} />
                                </ActionIcon>
                              )}
                            </NavLink>
                          </Tooltip>
                        )}
                      </Group>
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
      </SimpleGrid>
    </Section>
  );
}
