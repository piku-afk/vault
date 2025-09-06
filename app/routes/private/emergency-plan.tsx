import {
  Badge,
  Box,
  Card,
  Center,
  Group,
  Image,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { ArrowDown } from "lucide-react";

import { CurrencyFormatter } from "#/components/shared/currency-formatter";
import { Section } from "#/components/shared/section";
import {
  type EmergencyPlanStep,
  getEmergencyPlan,
} from "#/database/get-emergency-plan";
import { requireAuth } from "#/middlewares/requireAuth";

import type { Route } from "./+types/emergency-plan";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);

  return await getEmergencyPlan();
}

export default function EmergencyPlan({ loaderData }: Route.ComponentProps) {
  return (
    <Section mt="md" title="Financial Emergency Plan">
      <title>Vault - Emergency Plan</title>

      <Text c="dimmed" size="sm" mt={-6} mb="xl">
        Follow these steps in order during a financial emergency. Each step
        represents your next best option for accessing funds
      </Text>

      <RecursiveTimeline steps={loaderData} level={0} />
    </Section>
  );
}

export function RecursiveTimeline(props: {
  steps: EmergencyPlanStep[];
  level?: number;
}) {
  const level = props.level || 0;
  const isNestedLevel = level > 0;

  return (
    <Stack gap={isNestedLevel ? "xs" : 0} mt={isNestedLevel ? "md" : 0}>
      {props.steps.map((step, index) => {
        const color = step.color || "gray";
        const isLast = index === props.steps.length - 1;

        return (
          <Box key={step.id}>
            <Card
              withBorder={!isNestedLevel}
              shadow={isNestedLevel ? "none" : "xs"}
              p={isNestedLevel ? "md" : "lg"}
              bg={isNestedLevel ? `${color}.0` : "white"}
              style={(theme) => ({
                borderColor: isNestedLevel
                  ? theme.colors[color][2]
                  : theme.colors.gray[2],
                borderWidth: isNestedLevel ? 1 : 1,
                borderStyle: isNestedLevel ? "dashed" : "solid",
              })}
            >
              <Group align="flex-start" gap="md" wrap="nowrap">
                {!isNestedLevel && (
                  <Box>
                    <Badge
                      size="lg"
                      variant="filled"
                      color={color}
                      style={{ minWidth: 32 }}
                    >
                      LEVEL {index + 1}
                    </Badge>
                  </Box>
                )}

                {step.title && (
                  <Title
                    order={isNestedLevel ? 4 : 3}
                    size={isNestedLevel ? "md" : "lg"}
                    fw={isNestedLevel ? 500 : 600}
                    lh={1.3}
                  >
                    {step.title}
                  </Title>
                )}

                <ThemeIcon
                  size="md"
                  variant="light"
                  color={color}
                  ml="auto"
                  style={{ flexShrink: 0 }}
                >
                  <Image
                    loading="lazy"
                    src={step.icon}
                    alt={step.title ?? ""}
                    w="auto"
                    h={18}
                  />
                </ThemeIcon>
              </Group>

              {step.subtext && (
                <Text
                  mt={4}
                  c="dimmed"
                  size={isNestedLevel ? "xs" : "sm"}
                  lh={1.4}
                >
                  {step.subtext}
                </Text>
              )}
              {step.amount !== null && (
                <Group mt={4} gap="xs" align="center">
                  <Text size="sm" c="dimmed">
                    Available:
                  </Text>
                  <Text fw={600} size="sm" c={color}>
                    <CurrencyFormatter value={step.amount} />
                  </Text>
                  {step.is_approx_amount && (
                    <Badge size="xs" variant="light" color="gray">
                      approx
                    </Badge>
                  )}
                </Group>
              )}

              {!!step.children?.length && (
                <RecursiveTimeline steps={step.children} level={level + 1} />
              )}
            </Card>

            {!isLast && !isNestedLevel && (
              <Center my="md">
                <ThemeIcon variant="light" color="gray" size="md">
                  <ArrowDown size={18} />
                </ThemeIcon>
              </Center>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
