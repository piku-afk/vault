import {
  Card,
  Group,
  NumberFormatter,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { TrendingDown, TrendingUp } from "lucide-react";
import { use } from "react";

import { useOverviewLoaderData } from "#/routes/private/overview";
import type { getBestAndWorstPerformer } from "#/utils/getPortfolioAnalytics.server";

export function MonthlyPerformersSkeleton() {
  return (
    <Card withBorder p="sm">
      <Stack gap="sm">
        <Text fw={600} size="md">
          Last Month's Performance
        </Text>
        <SimpleGrid cols={2} spacing="xs">
          {Array.from(Array(2).keys()).map((item) => (
            <Card key={item} withBorder p="xs">
              <Stack gap={4}>
                <Skeleton height={14} width={80} />
                <Skeleton height={12} width={100} />
                <Skeleton height={16} width={40} />
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

function PerformerSection({
  scheme,
  variant,
}: {
  scheme: Awaited<ReturnType<typeof getBestAndWorstPerformer>>["bestPerformer"];
  variant: "best" | "worst";
}) {
  const isBest = variant === "best";
  const color = isBest ? "teal" : "red";

  return (
    <Card
      withBorder
      p="xs"
      bg={`${color}.0`}
      style={(theme) => ({ borderColor: theme.colors[color][3] })}
    >
      <Stack gap={4}>
        <Group gap={4}>
          {isBest ? (
            <TrendingUp size={12} color={color} />
          ) : (
            <TrendingDown size={12} color={color} />
          )}
          <Text size="xs" c={color}>
            {isBest ? "Best" : "Worst"}
          </Text>
        </Group>
        <Text size="xs" lineClamp={1}>
          {scheme.scheme_name}
        </Text>
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed" style={{ flex: 1 }}>
            {scheme.saving_category}
          </Text>
          <Text fw={600} size="xs" c={color}>
            <NumberFormatter
              value={scheme.nav_diff_percentage || 0}
              suffix="%"
            />
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}

export function MonthlyPerformers() {
  const { bestAndWorstPerformer } = useOverviewLoaderData();
  const { bestPerformer, worstPerformer } = use(bestAndWorstPerformer);

  return (
    <Card withBorder p="sm">
      <Stack gap="sm">
        <Text size="md">Last Month's Performance</Text>
        <SimpleGrid cols={2} spacing="xs">
          <PerformerSection variant="best" scheme={bestPerformer} />
          <PerformerSection variant="worst" scheme={worstPerformer} />
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
