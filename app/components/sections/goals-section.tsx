import {
  Badge,
  Box,
  Card,
  Group,
  Image,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import { getGoalColor } from "#/utils/financialHelpers";

import { CurrencyFormatter } from "../shared/currency-formatter";
import { Section } from "../shared/section";

export function GoalsSection(props: {
  title: string;
  data: Promise<
    {
      icon: string;
      current: number;
      name: string;
      target: number;
      remaining: number;
      progress: number;
      is_complete: boolean;
    }[]
  >;
}) {
  return (
    <Section title={props.title}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(2).keys()).map((item) => (
            <Card withBorder key={item}>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Box>
                    <Group gap="xs" mb="xs">
                      <Skeleton height={42} width={40} radius="md" />
                      <Skeleton height={20} width={120} />
                    </Group>
                    <Skeleton height={16} width={100} />
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
          ))}
        >
          <Await resolve={props.data}>
            {(goalProgress) =>
              goalProgress.map((goal) => {
                const color = getGoalColor(goal.progress, goal.is_complete);

                return (
                  <Card
                    key={goal.name}
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
                        </Box>
                        <Tooltip label="Goal Progress">
                          <Badge variant="light" color={color} size="lg">
                            {goal.progress}%
                          </Badge>
                        </Tooltip>
                      </Group>

                      <Progress value={goal.progress} color={color} size="md" />

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
                          <Text
                            fw={600}
                            size="sm"
                            c={goal.is_complete ? "teal" : "dimmed"}
                          >
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
              })
            }
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
