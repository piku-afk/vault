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

import { CurrencyFormatter } from "#/components/currency-formatter";
import type { getSavingsCategorySummary } from "#/database/getSummaryBySavingsCategory.server";

// Types
type CategoryData = Awaited<
  ReturnType<typeof getSavingsCategorySummary>
>[number];

interface CategoryCardProps {
  category: CategoryData;
  onViewDetails?: () => void;
}

interface StatItemProps {
  label: string;
  value: number;
  color?: string;
  prefix?: string;
  allowNegative?: boolean;
}

// Constants
const PROGRESS_MAX_VALUE = 150;

// Utilities
const calculateProgressValue = (current: number, invested: number): number => {
  return invested > 0
    ? Math.min(((current - invested) / invested) * 100, PROGRESS_MAX_VALUE)
    : 0;
};

const getReturnColor = (returns: number): string =>
  returns > 0 ? "teal" : "red";

const formatSchemeCount = (count: number): string =>
  `${count} ${count === 1 ? "Scheme" : "Schemes"}`;

// Components
function StatItem({
  label,
  value,
  color,
  prefix,
  allowNegative = true,
}: StatItemProps) {
  return (
    <Box>
      <Text size="xs" c="dimmed" mb={2}>
        {label}
      </Text>
      <Text fw={500} size="sm" c={color}>
        <CurrencyFormatter
          value={value}
          prefix={prefix}
          allowNegative={allowNegative}
        />
      </Text>
    </Box>
  );
}

function CategoryHeader({
  category,
  returnColor,
  onViewDetails,
}: {
  category: CategoryData;
  returnColor: string;
  onViewDetails?: () => void;
}) {
  const isPositive = category.returns > 0;

  return (
    <Group align="flex-start">
      <ThemeIcon mt={2} variant="default" size="lg">
        <Image
          loading="lazy"
          src={category.icon}
          alt={category.name}
          w="auto"
          h={20}
        />
      </ThemeIcon>
      <Box>
        <Text size="lg">{category.name}</Text>
        <Text size="sm" c="dimmed">
          {formatSchemeCount(Number(category.schemes_count))}
        </Text>
      </Box>
      <Tooltip label="Returns percentage">
        <Badge ml="auto" variant="light" color={returnColor} size="lg">
          <NumberFormatter
            value={category.returns_percentage}
            suffix="%"
            decimalScale={2}
            allowNegative={false}
            prefix={isPositive ? "+" : "-"}
          />
        </Badge>
      </Tooltip>
      <Tooltip label="View details">
        <ActionIcon variant="default" onClick={onViewDetails}>
          <Maximize2 size={14} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

function CategoryStats({
  category,
  returnColor,
}: {
  category: CategoryData;
  returnColor: string;
}) {
  const isPositive = category.returns > 0;

  return (
    <SimpleGrid cols={2} spacing="sm">
      <StatItem label="Current" value={category.current} />
      <StatItem label="Invested" value={category.invested} />
      <StatItem
        label="Returns"
        value={category.returns}
        color={returnColor}
        prefix={isPositive ? "+" : "-"}
        allowNegative={false}
      />
      <StatItem label="Monthly SIP" value={Number(category.monthly_sip)} />
    </SimpleGrid>
  );
}

export function CategoryCard({ category }: CategoryCardProps) {
  const progressValue = calculateProgressValue(
    category.current,
    category.invested,
  );
  const returnColor = getReturnColor(category.returns);

  return (
    <Card withBorder>
      <Stack gap="md">
        <CategoryHeader category={category} returnColor={returnColor} />

        <Progress
          value={progressValue}
          color={returnColor}
          size="sm"
          radius="xl"
        />

        <CategoryStats category={category} returnColor={returnColor} />
      </Stack>
    </Card>
  );
}

export function CategoryCardSkeleton() {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Group align="flex-start">
          <ThemeIcon mt={2} variant="default" size="lg">
            <Skeleton height={20} width={20} />
          </ThemeIcon>
          <Box>
            <Skeleton height={24} width={120} mb={6} />
            <Skeleton height={19} width={80} />
          </Box>
          <Skeleton height={28} width={80} ml="auto" />
          <Skeleton height={32} width={32} />
        </Group>

        <Skeleton height={8} radius="xl" />

        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
          {Array.from(Array(4).keys()).map((item) => (
            <Box key={item} style={{ flexShrink: 0 }}>
              <Skeleton height={14} width={50} mb={6} />
              <Skeleton height={16} width={70} />
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
