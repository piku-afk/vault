import {
  Box,
  Card,
  Group,
  Progress,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { use } from "react";

import { useOverviewLoaderData } from "#/routes/private/overview";

export function PortfolioHealth() {
  const { positiveCounts } = useOverviewLoaderData();
  const { positive, total } = use(positiveCounts);
  const positivePercentage = (positive / total) * 100;

  return (
    <Card withBorder>
      <Stack gap={8}>
        <Text size="md">Portfolio Health</Text>
        <Box>
          <Text mb={2} size="xs" c="dimmed">
            Positive vs Negative Returns
          </Text>

          <Group wrap="nowrap">
            <Progress
              size="md"
              color="teal"
              value={positivePercentage}
              style={{ flexGrow: 1 }}
            />

            <Text size="sm" style={{ flexShrink: 0 }}>
              {positive}/{total}
            </Text>
          </Group>

          <Text size="xs" c="dimmed">
            {positivePercentage.toFixed(0)}% of schemes are profitable compared
            to last month.
          </Text>
        </Box>
      </Stack>
    </Card>
  );
}

export function PerformanceCountCardSkeleton() {
  return (
    <Card withBorder>
      <Stack gap={8}>
        <Text size="md">Portfolio Health</Text>
        <Box mt={6}>
          <Skeleton mb={6} height={12} width="40%" />
          <Group wrap="nowrap" justify="space-between">
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="10%" />
          </Group>
          <Skeleton mt={6} height={12} width="50%" />
        </Box>
      </Stack>
    </Card>
  );
}
