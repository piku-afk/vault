import {
  Badge,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Target } from "lucide-react";

import { CurrencyFormatter } from "#/components/currency-formatter";

interface Goal {
  id: string;
  name: string;
  target: number;
  progress: number;
  achieved: boolean;
  remaining: number;
}

interface InvestmentGoalsProps {
  goalProgress: Goal[];
  netWorth: number;
}

export function InvestmentGoals({
  goalProgress,
  netWorth,
}: InvestmentGoalsProps) {
  if (goalProgress.length === 0) return null;

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
      {goalProgress.map((goal) => (
        <Card key={goal.id} withBorder radius="lg" p="lg">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Group gap="xs" mb="xs">
                  <ThemeIcon
                    variant="light"
                    color="violet"
                    size="sm"
                    radius="md"
                  >
                    <Target size={14} />
                  </ThemeIcon>
                  <Text fw={600} size="lg">
                    {goal.name}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  Target: <CurrencyFormatter value={goal.target} />
                </Text>
              </div>
              <Badge
                variant="light"
                color={
                  goal.achieved
                    ? "teal"
                    : goal.progress > 75
                      ? "yellow"
                      : "blue"
                }
                size="lg"
              >
                {goal.progress.toFixed(1)}%
              </Badge>
            </Group>

            <Progress
              value={goal.progress}
              color={
                goal.achieved ? "teal" : goal.progress > 75 ? "yellow" : "blue"
              }
              size="lg"
              radius="xl"
            />

            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" mb={2}>
                  Current Progress
                </Text>
                <Text fw={600} size="sm">
                  <CurrencyFormatter value={netWorth} />
                </Text>
              </div>
              <div style={{ textAlign: "right" }}>
                <Text size="xs" c="dimmed" mb={2}>
                  {goal.achieved ? "Achieved!" : "Remaining"}
                </Text>
                <Text
                  fw={600}
                  size="sm"
                  c={goal.achieved ? "teal.7" : "dimmed"}
                >
                  {goal.achieved ? (
                    "🎉 Goal Reached!"
                  ) : (
                    <CurrencyFormatter value={goal.remaining} />
                  )}
                </Text>
              </div>
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
