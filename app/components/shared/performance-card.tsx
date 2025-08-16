import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  Image,
  NumberFormatter,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { Maximize2 } from "lucide-react";
import type { ReactNode, RefObject } from "react";

import { useInContainer } from "#/hooks/use-in-container";
import {
  calculateProgressValue,
  type FinancialData,
  getReturnsColor,
  getReturnsPrefix,
} from "#/utils/financialHelpers";

import { StatItem } from "./stat-item";

interface BaseFinancialData extends FinancialData {
  returns_percentage: number;
  monthly_sip: number;
}

interface PerformanceCardProps {
  data: BaseFinancialData;
  icon: string;
  iconAlt: string;
  title: string;
  subtitle?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  actionTooltip?: string;
  additionalStats?: Array<{
    label: string;
    value: number;
    color?: string;
    prefix?: string;
    allowNegative?: boolean;
  }>;
}

export function PerformanceCard({
  data,
  icon,
  iconAlt,
  title,
  subtitle,
  onAction,
  actionIcon = <Maximize2 size={14} />,
  actionTooltip = "View details",
  additionalStats = [],
}: PerformanceCardProps) {
  const { isInContainer: isInDialog, ref } = useInContainer("dialog");
  const progressValue = calculateProgressValue(data);
  const returnColor = getReturnsColor(data.returns);

  // Responsive sizing based on container
  const iconSize = isInDialog ? "sm" : "md";
  const titleSize = isInDialog ? "sm" : "lg";
  const badgeSize = isInDialog ? "sm" : "lg";
  const cardSpacing = isInDialog ? "sm" : "md";

  return (
    <Card ref={ref as RefObject<HTMLDivElement>} withBorder>
      <Stack gap={cardSpacing}>
        <Group align="flex-start" wrap="nowrap" gap="xs">
          <ThemeIcon
            mt={isInDialog ? 1 : 2}
            variant="default"
            size={iconSize === "sm" ? "md" : "lg"}
          >
            <Image
              loading="lazy"
              src={icon}
              alt={iconAlt}
              w="auto"
              h={iconSize === "sm" ? 12 : 20}
            />
          </ThemeIcon>
          <Box>
            <Text size={titleSize} lineClamp={1}>
              {title}
            </Text>
            {subtitle && (
              <Text size="xs" c="dimmed">
                {subtitle}
              </Text>
            )}
          </Box>
          <Tooltip label="Returns percentage">
            <Badge
              ml="auto"
              variant="light"
              color={returnColor}
              size={badgeSize}
              style={{ flexShrink: 0 }}
            >
              <NumberFormatter
                value={data.returns_percentage}
                suffix="%"
                decimalScale={2}
                allowNegative={false}
                prefix={getReturnsPrefix(data.returns)}
              />
            </Badge>
          </Tooltip>
          {onAction && (
            <Tooltip label={actionTooltip}>
              <ActionIcon variant="default" onClick={onAction} size={iconSize}>
                {actionIcon}
              </ActionIcon>
            </Tooltip>
          )}
        </Group>

        <Progress
          value={progressValue}
          color={returnColor}
          size="sm"
          radius="xl"
        />

        <SimpleGrid cols={2} spacing="sm">
          <StatItem label="Current" value={data.current} />
          <StatItem label="Invested" value={data.invested} />
          <StatItem
            label="Returns"
            value={data.returns}
            color={returnColor}
            prefix={getReturnsPrefix(data.returns)}
            allowNegative={false}
          />
          <StatItem label="Monthly SIP" value={data.monthly_sip} />
          {additionalStats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

export function PerformanceCardSkeleton() {
  const { isInContainer: isInDialog, ref } = useInContainer("dialog");

  const iconSize = isInDialog ? 16 : 20;
  const titleHeight = isInDialog ? 20 : 24;
  const titleWidth = isInDialog ? 100 : 120;
  const cardSpacing = isInDialog ? "sm" : "md";

  return (
    <Card
      ref={ref as RefObject<HTMLDivElement>}
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
  );
}
