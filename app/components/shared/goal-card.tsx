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
import { CircleCheckBig, Target } from "lucide-react";

import type { getGoalsProgress } from "#/database/get-goals-progress";
import { getGoalColor, getGoalCompletionDate } from "#/utils/financialHelpers";

import { CurrencyFormatter } from "./currency-formatter";

export function GoalCardSkeleton() {
  return (
    <Card withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Box>
            <Group gap="xs" mb="xs">
              <Skeleton height={36} width={36} radius="md" />
              <Skeleton height={24} width={140} />
            </Group>
            <Skeleton height={14} width={180} />
            <Skeleton height={12} width={160} mt={4} />
          </Box>
          <Skeleton height={32} width={32} radius="xl" />
        </Group>

        <Group>
          <Skeleton height={16} radius="xl" style={{ flexGrow: 1 }} />
          <Skeleton
            height={24}
            width={50}
            radius="xl"
            style={{ flexShrink: 0 }}
          />
        </Group>

        <Group justify="space-between">
          <Box>
            <Skeleton height={12} width={100} mb={6} />
            <Skeleton height={16} width={80} />
          </Box>
          <Box ta="right">
            <Skeleton height={12} width={70} mb={6} ml="auto" />
            <Skeleton height={16} width={90} />
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}

export function GoalCard({
  goal,
}: {
  goal: Exclude<
    Awaited<ReturnType<typeof getGoalsProgress>>[number],
    undefined
  >;
}) {
  const color = getGoalColor(Number(goal.progress), goal.is_complete ?? false);
  const completionDate = getGoalCompletionDate(
    Number(goal.remaining),
    Number(goal.sip_amount),
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
                  alt={goal.name ?? ""}
                  w="auto"
                  h={20}
                />
              </ThemeIcon>
              <Text size="lg">{goal.name}</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Target: <CurrencyFormatter value={goal.target ?? 0} />
            </Text>
            {!goal.is_complete && (
              <Text size="xs" c="dimmed" mt={4}>
                Expected completion: {completionDate.format("MMM, YYYY")}
              </Text>
            )}
          </Box>
          <Tooltip label={goal.is_complete ? "Goal Completed" : "In Progress"}>
            <ThemeIcon variant="light" color={color} size="md" radius="xl">
              {goal.is_complete ? (
                <CircleCheckBig size={16} />
              ) : (
                <Target size={16} />
              )}
            </ThemeIcon>
          </Tooltip>
        </Group>

        <Group>
          <Progress
            size="md"
            value={Number(goal.progress)}
            color={color}
            style={{ flexGrow: 1 }}
          />
          <Tooltip label="Goal Progress">
            <Badge
              variant="light"
              size="sm"
              color={color}
              style={{ flexShrink: 0 }}
            >
              {goal.progress}%
            </Badge>
          </Tooltip>
        </Group>

        <Group justify="space-between">
          <Box>
            <Text size="xs" c="dimmed" mb={2}>
              Current Progress
            </Text>
            <Text fw={600} size="sm">
              <CurrencyFormatter value={goal.current ?? 0} />
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
                <CurrencyFormatter value={goal.remaining ?? 0} />
              )}
            </Text>
          </Box>
        </Group>
      </Stack>
    </Card>
  );
}
