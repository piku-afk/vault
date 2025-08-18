import {
  Badge,
  Box,
  Card,
  Group,
  Image,
  Progress,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";

import type { getOverview } from "#/database/get-overview.server";
import { getGoalColor, getGoalCompletionDate } from "#/utils/financialHelpers";

import { CurrencyFormatter } from "./currency-formatter";

export function GoalCardSkeleton() {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Box>
            <Group gap="xs" mb="xs">
              <Skeleton height={42} width={40} radius="md" />
              <Skeleton height={20} width={120} />
            </Group>
            <Skeleton height={16} width={100} />
            <Skeleton height={12} width={140} mt={4} />
          </Box>
          <Skeleton height={24} width={60} radius="xl" />
        </Group>

        <Skeleton height={12} radius="xl" />

        <Group justify="space-between">
          <Box>
            <Skeleton height={12} width={80} mb={6} />
            <Skeleton height={16} width={60} />
          </Box>
          <Box ta="right">
            <Skeleton height={12} width={60} mb={6} ml="auto" />
            <Skeleton height={16} width={80} />
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}

export function GoalCard({
  goal,
}: {
  goal: Awaited<ReturnType<typeof getOverview>["goals"]>[number];
}) {
  const color = getGoalColor(Number(goal.progress), goal.is_complete);
  const completionDate = getGoalCompletionDate(
    Number(goal.remaining),
    Number(goal.monthly_sip),
  );

  return (
    <Card
      withBorder
      bg={`${color}.0`}
      style={(theme) => ({ borderColor: theme.colors[color][3] })}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Box>
            <Group gap="xs" mb="xs">
              <ThemeIcon mt={2} variant="default" size="lg">
                <Image
                  loading="lazy"
                  src={goal.icon}
                  alt={goal.name}
                  w="auto"
                  h={20}
                />
              </ThemeIcon>
              <Text size="lg">{goal.name}</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Target: <CurrencyFormatter value={goal.target} />
            </Text>
            {!goal.is_complete && (
              <Text size="xs" c="dimmed" mt={4}>
                Expected completion: {completionDate.format("MMM, YYYY")}
              </Text>
            )}
          </Box>
          <Tooltip label="Goal Progress">
            <Badge variant="light" color={color} size="lg">
              {goal.progress}%
            </Badge>
          </Tooltip>
        </Group>

        <Progress value={Number(goal.progress)} color={color} size="md" />

        <Group justify="space-between">
          <Box>
            <Text size="xs" c="dimmed" mb={2}>
              Current Progress
            </Text>
            <Text fw={600} size="sm">
              <CurrencyFormatter value={goal.current} />
            </Text>
          </Box>
          <Box ta="right">
            <Text size="xs" c="dimmed" mb={2}>
              {goal.is_complete ? "Achieved!" : "Remaining"}
            </Text>
            <Text fw={600} size="sm" c={goal.is_complete ? "teal" : "dimmed"}>
              {goal.is_complete ? (
                "Goal Reached!"
              ) : (
                <CurrencyFormatter value={goal.remaining} />
              )}
            </Text>
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}
