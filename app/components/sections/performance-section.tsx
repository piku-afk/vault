import {
  ActionIcon,
  Box,
  Card,
  Group,
  Image,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { Info } from "lucide-react";
import { type RefObject, Suspense } from "react";
import { Await, NavLink } from "react-router";

import type { getOverview } from "#/database/get-overview.server";
import { useInContainer } from "#/hooks/use-in-container";
import {
  calculateProgressValue,
  getReturnsColor,
  getReturnsPrefix,
} from "#/utils/financialHelpers";

import { ReturnsPercentageBadge } from "../shared/returns-percentage-badge";
import { Section } from "../shared/section";
import { StatItem } from "../shared/stat-item";

export function PerformanceSection(props: {
  title: string;
  data: ReturnType<typeof getOverview>["performanceData"];
}) {
  const { isInContainer: isInDialog, ref } = useInContainer("dialog");

  // Responsive sizing based on container
  const iconSize = isInDialog ? "sm" : "md";
  const titleSize = isInDialog ? "sm" : "lg";
  const titleWidth = isInDialog ? 100 : 120;
  const titleHeight = isInDialog ? 20 : 24;
  const badgeSize = isInDialog ? "sm" : "lg";
  const cardSpacing = isInDialog ? "sm" : "md";

  return (
    <Section ref={ref as RefObject<HTMLDivElement>} title={props.title}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(4).keys()).map((item) => (
            <Card
              key={item}
              withBorder
              style={{ containerType: "inline-size" }}
            >
              <Stack gap={cardSpacing}>
                <Group align="flex-start">
                  <ThemeIcon mt={2} variant="default" size="lg">
                    <Skeleton height={iconSize} width={iconSize} />
                  </ThemeIcon>
                  <Box>
                    <Skeleton height={titleHeight} width={titleWidth} mb={6} />
                    <Skeleton height={19} width={80} />
                  </Box>
                  <Skeleton height={28} width={80} ml="auto" />
                  <Skeleton height={32} width={32} />
                </Group>

                <Skeleton height={8} radius="xl" />

                <SimpleGrid cols={2} spacing="md">
                  {Array.from(Array(4).keys()).map((item) => (
                    <Box key={item} style={{ flexShrink: 0 }}>
                      <Skeleton height={14} width={50} mb={4} />
                      <Skeleton height={16} width={70} />
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </Card>
          ))}
        >
          <Await resolve={props.data}>
            {(data) =>
              data.map((item) => {
                const current = Number(item.current);
                const invested = Number(item.invested);
                const returns = Number(item.returns);
                const monthlySip = Number(item.monthly_sip);
                const returnColor = getReturnsColor(returns);
                const returnPrefix = getReturnsPrefix(returns);
                const progressValue = calculateProgressValue({
                  current,
                  invested,
                  returns,
                });

                return (
                  <Card key={item.name} withBorder>
                    <Stack gap={cardSpacing}>
                      <Group align="flex-start" wrap="nowrap" gap="xs">
                        <ThemeIcon
                          mt={isInDialog ? 1 : 2}
                          variant="default"
                          size={iconSize === "sm" ? "md" : "lg"}
                        >
                          <Image
                            loading="lazy"
                            src={item.icon}
                            alt={item.iconAlt}
                            w="auto"
                            h={iconSize === "sm" ? 12 : 20}
                          />
                        </ThemeIcon>
                        <Box>
                          <Group align="baseline" gap="xs">
                            <Text size={titleSize} lineClamp={1}>
                              {item.name}
                            </Text>
                            {item.action_route && (
                              <Tooltip label="View Details">
                                <NavLink
                                  to={item.action_route}
                                  preventScrollReset
                                >
                                  {({ isPending }) => (
                                    <ActionIcon
                                      variant="light"
                                      size="sm"
                                      loading={isPending}
                                    >
                                      <Info size={14} />
                                    </ActionIcon>
                                  )}
                                </NavLink>
                              </Tooltip>
                            )}
                          </Group>
                          {item.subtitle && (
                            <Text size="xs" c="dimmed">
                              {item.subtitle}
                            </Text>
                          )}
                        </Box>
                        <ReturnsPercentageBadge
                          value={item.returns_percentage}
                          badgeProps={{ size: badgeSize }}
                        />
                      </Group>

                      <Progress
                        value={progressValue}
                        color={returnColor}
                        size="sm"
                        radius="xl"
                      />

                      <SimpleGrid cols={2} spacing="sm">
                        <StatItem label="Current" value={current} />
                        <StatItem label="Invested" value={invested} />
                        <StatItem
                          label="Returns"
                          value={returns}
                          color={returnColor}
                          prefix={returnPrefix}
                          allowNegative={false}
                        />
                        <StatItem label="Monthly SIP" value={monthlySip} />
                      </SimpleGrid>
                    </Stack>
                  </Card>
                );
              })
            }
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
