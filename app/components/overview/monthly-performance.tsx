import {
  Card,
  Group,
  NumberFormatter,
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
    <Card withBorder>
      <Stack gap="lg">
        <Text fw={600} size="lg">
          Last Month's Performance
        </Text>

        {Array.from(Array(2).keys()).map((item) => (
          <Stack key={item} gap="sm">
            <Group gap="xs">
              <Skeleton height={20} width={100} />
            </Group>
            <Stack gap="sm">
              <Card withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack gap={8}>
                    <Skeleton height={18} width={60} />
                    <Skeleton height={12} width={120} />
                  </Stack>
                  <Skeleton height={16} width={50} />
                </Group>
              </Card>
            </Stack>
          </Stack>
        ))}
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
    <Stack gap="xs">
      <Group gap="xs">
        {isBest ? (
          <TrendingUp size={16} color={color} />
        ) : (
          <TrendingDown size={16} color={color} />
        )}
        <Text fw={500} size="sm" c={color}>
          {isBest ? "Best Performer" : "Worst Performer"}
        </Text>
      </Group>
      <Stack gap="sm">
        <Card
          withBorder
          bg={`${color}.0`}
          style={(theme) => ({ borderColor: theme.colors[color][3] })}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Stack gap={2}>
              <Text fw={500} size="sm" lineClamp={1}>
                {scheme.scheme_name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {scheme.saving_category}
              </Text>
            </Stack>
            <Text fw={600} size="sm" style={{ flexShrink: 0 }}>
              <NumberFormatter
                value={scheme.nav_diff_percentage || 0}
                suffix="%"
              />
            </Text>
          </Group>
        </Card>
      </Stack>
    </Stack>
  );
}

export function MonthlyPerformers() {
  const { bestAndWorstPerformer } = useOverviewLoaderData();
  const { bestPerformer, worstPerformer } = use(bestAndWorstPerformer);

  return (
    <Card withBorder>
      <Stack gap="lg">
        <Text fw={600} size="lg">
          Last Month's Performance
        </Text>

        <PerformerSection variant="best" scheme={bestPerformer} />
        <PerformerSection variant="worst" scheme={worstPerformer} />
      </Stack>
    </Card>
  );
}
