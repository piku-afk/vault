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

import { CurrencyFormatter } from "#/components/currency-formatter";
import type { getSavingsCategorySummary } from "#/utils/getSummaryBySavingsCategory.server";
import { Maximize2 } from "lucide-react";

const calculateProgressValue = (current: number, invested: number): number => {
  return invested > 0 ? Math.min((current / invested) * 100, 150) : 0;
};

export function CategoryCard({
  category,
}: {
  category: Awaited<ReturnType<typeof getSavingsCategorySummary>>[number];
}) {
  const progressValue = calculateProgressValue(
    category.current,
    category.invested,
  );
  const isCategoryPositive = category.returns > 0;
  const returnColor = isCategoryPositive ? "teal" : "red";

  return (
    <Card withBorder>
      <Stack gap="md">
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
              {category.schemes_count}&nbsp;
              {category.schemes_count === 1 ? "Scheme" : "Schemes"}
            </Text>
          </Box>
          <Tooltip label="Returns percentage">
            <Badge ml="auto" variant="light" color={returnColor} size="lg">
              <NumberFormatter
                value={category.returns_percentage}
                suffix="%"
                decimalScale={2}
                allowNegative={false}
                prefix={isCategoryPositive ? "+" : "-"}
              />
            </Badge>
          </Tooltip>
          <Tooltip label="View details">
            <ActionIcon variant="default">
              <Maximize2 size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Progress
          value={progressValue}
          color={returnColor}
          size="sm"
          radius="xl"
        />

        <SimpleGrid cols={3} spacing="xs">
          <Box>
            <Text size="xs" c="dimmed" mb={2}>
              Current
            </Text>
            <Text fw={500} size="sm">
              <CurrencyFormatter value={category.current} />
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" mb={2}>
              Invested
            </Text>
            <Text fw={500} size="sm">
              <CurrencyFormatter value={category.invested} />
            </Text>
          </Box>

          <Box>
            <Text size="xs" c="dimmed" mb={2}>
              Returns
            </Text>
            <Text fw={500} size="sm" c={returnColor}>
              <CurrencyFormatter
                value={category.returns}
                allowNegative={false}
                prefix={isCategoryPositive ? "+" : "-"}
              />
            </Text>
          </Box>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

export function CategoryCardSkeleton() {
  return (
    <Card withBorder>
      <Stack gap="lg">
        <Group align="flex-start">
          <Box>
            <Skeleton height={20} width={120} mb={6} />
            <Skeleton height={16} width={80} />
          </Box>
          <Skeleton height={28} width={80} ml="auto" />
        </Group>

        <Skeleton height={8} />

        <SimpleGrid cols={3} spacing="xs">
          <Box>
            <Skeleton height={14} width={50} mb={6} />
            <Skeleton height={16} width={70} />
          </Box>
          <Box>
            <Skeleton height={14} width={50} mb={6} />
            <Skeleton height={16} width={70} />
          </Box>
          <Box>
            <Skeleton height={14} width={50} mb={6} />
            <Skeleton height={16} width={70} />
          </Box>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
