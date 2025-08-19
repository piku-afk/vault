import {
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
} from "@mantine/core";
import { type RefObject, Suspense } from "react";
import { Await } from "react-router";

import type { getOverview } from "#/database/get-overview.server";
import type { getXIRR } from "#/database/get-xirr.server";
import { useInContainer } from "#/hooks/use-in-container";
import {
  calculateProgressValue,
  getReturnsColor,
  getReturnsPrefix,
} from "#/utils/financialHelpers";

import { ReturnsPercentageBadge } from "../shared/returns-percentage-badge";
import { Section } from "../shared/section";
import { StatItem } from "../shared/stat-item";
import { ViewDetailsActionIcon } from "../shared/view-details-action-icon";
import { XirrPercentageBadge } from "../shared/xirr-percentage-badge";

export function PerformanceSection(props: {
  title: string;
  data: ReturnType<typeof getOverview>["performanceData"];
  xirr: ReturnType<typeof getXIRR>;
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
                    <Group mt={4} gap="xs">
                      <Skeleton height={16} width={80} />
                      <Skeleton height={12} width={80} />
                    </Group>
                  </Box>
                  <Skeleton height={28} width={80} ml="auto" />
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
                              <ViewDetailsActionIcon to={item.action_route} />
                            )}
                          </Group>
                          <Group mt={4} gap="xs">
                            <Suspense
                              fallback={<Skeleton height={16} width={80} />}
                            >
                              <Await resolve={props.xirr}>
                                {({ scheme }) => (
                                  <XirrPercentageBadge
                                    value={scheme[item.name as string] ?? 0}
                                  />
                                )}
                              </Await>
                            </Suspense>
                            {item.subtitle && (
                              <Text size="xs" c="dimmed">
                                {item.subtitle}
                              </Text>
                            )}
                          </Group>
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
