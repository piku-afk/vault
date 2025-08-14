import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { TrendingDown, TrendingUp } from "lucide-react";
import { use } from "react";

import type { getBestAndWorstPerformer } from "#/database/getPortfolioAnalytics.server";
import { useOverviewLoaderData } from "#/routes/private/overview";

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
    <Card withBorder p="xs">
      <Stack gap={4}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text size="xs" lineClamp={1}>
            {scheme.scheme_name}
          </Text>
          <Group gap={2} wrap="nowrap" style={{ flexShrink: 0 }}>
            <Badge
              variant="subtle"
              color={color}
              size="xs"
              style={{ flexShrink: 0 }}
              leftSection={
                isBest ? (
                  <TrendingUp size={12} color={color} />
                ) : (
                  <TrendingDown size={12} color={color} />
                )
              }
            >
              {isBest ? "Best" : "Worst"}
            </Badge>
            <Tooltip label="Returns percentage">
              <Badge
                size="sm"
                variant="light"
                color={color}
                style={{ flexShrink: 0 }}
              >
                <NumberFormatter
                  value={scheme.nav_diff_percentage || 0}
                  suffix="%"
                />
              </Badge>
            </Tooltip>
          </Group>
        </Group>
        <Text size="xs" c="dimmed" style={{ flex: 1 }}>
          {scheme.saving_category}
        </Text>
      </Stack>
    </Card>
  );
}

export function MonthlyPerformers() {
  const { bestAndWorstPerformer } = useOverviewLoaderData();
  const { bestPerformer, worstPerformer } = use(bestAndWorstPerformer);

  return (
    <Card withBorder>
      <Text size="md">Last Month's Performance</Text>
      <Stack mt="sm" gap="xs">
        <PerformerSection variant="best" scheme={bestPerformer} />
        <PerformerSection variant="worst" scheme={worstPerformer} />
      </Stack>
    </Card>
  );
}

export function MonthlyPerformersSkeleton() {
  return (
    <Card withBorder>
      <Stack gap="sm">
        <Text size="md">Last Month's Performance</Text>
        <Stack mt={2} gap="xs">
          {Array.from(Array(2).keys()).map((item) => (
            <Card key={item} withBorder p="xs">
              <Stack gap={4}>
                <Group justify="space-between" wrap="nowrap">
                  <Skeleton height={14} width="60%" />
                  <Group wrap="nowrap">
                    <Skeleton height={12} width={50} />
                    <Skeleton height={12} width={30} />
                  </Group>
                </Group>
                <Skeleton mt={6} height={14} width="30%" />
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
