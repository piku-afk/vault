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
                <Group align="flex-start" wrap="nowrap" gap="xs">
                  <ThemeIcon
                    mt={isInDialog ? 1 : 2}
                    variant="default"
                    size={iconSize === "sm" ? "md" : "lg"}
                  >
                    <Skeleton
                      height={iconSize === "sm" ? 12 : 20}
                      width={iconSize === "sm" ? 12 : 20}
                    />
                  </ThemeIcon>
                  <Box>
                    <Group align="baseline" gap="xs">
                      <Skeleton height={titleHeight} width={titleWidth} />
                      <Skeleton height={12} width={12} radius="xl" />
                    </Group>
                    <Skeleton height={12} width={60} mt={2} />
                  </Box>
                  <Skeleton ml="auto" height={20} width={50} radius="xl" />
                </Group>

                <Group>
                  <Skeleton height={8} radius="xl" style={{ flexGrow: 1 }} />
                  <Skeleton
                    height={20}
                    width={45}
                    radius="xl"
                    style={{ flexShrink: 0 }}
                  />
                </Group>

                <SimpleGrid cols={2} spacing="sm">
                  {Array.from(Array(4).keys()).map((statItem) => (
                    <Box key={statItem} style={{ flexShrink: 0 }}>
                      <Skeleton height={12} width={50} mb={4} />
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
                          {item.subtitle && (
                            <Text size="xs" c="dimmed">
                              {item.subtitle}
                            </Text>
                          )}
                        </Box>
                        <Suspense
                          fallback={
                            <Skeleton
                              ml="auto"
                              height={20}
                              width={80}
                              radius="xl"
                            />
                          }
                        >
                          <Await resolve={props.xirr}>
                            {({ scheme }) => (
                              <XirrPercentageBadge
                                value={scheme[item.name as string] ?? 0}
                                badgeProps={{ ml: "auto", size: "sm" }}
                              />
                            )}
                          </Await>
                        </Suspense>
                      </Group>

                      <Group>
                        <Progress
                          value={progressValue}
                          color={returnColor}
                          size="md"
                          radius="xl"
                          style={{ flexGrow: 1 }}
                        />
                        <ReturnsPercentageBadge
                          value={item.returns_percentage}
                          badgeProps={{ size: "sm", style: { flexShrink: 0 } }}
                        />
                      </Group>

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
