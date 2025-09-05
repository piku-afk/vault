import {
  Box,
  Card,
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

      <Text mb="xl" c="dimmed" size="sm">
        Your step-by-step plan for accessing funds in a financial emergency.
      </Text>

      <RecursiveTimeline steps={loaderData} />
    </Section>
  );
}

export function RecursiveTimeline(props: { steps: EmergencyPlanStep[] }) {
  return (
    <Stack gap="xs" mt="md">
      {props.steps.map((step, index) => {
        const color = step.color || "gray";
        const isLast = index === props.steps.length - 1;

        return (
          <Box key={step.id}>
            <Card
              withBorder
              bg={`${color}.0`}
              style={(theme) => ({
                borderColor: theme.colors[color][3],
              })}
            >
              <Group align="flex-start" gap="md">
                <ThemeIcon size="lg" variant="default">
                  <Image
                    loading="lazy"
                    src={step.icon}
                    alt={step.title}
                    w="auto"
                    h={20}
                  />
                </ThemeIcon>

                <Box flex={1}>
                  <Stack mb={8} gap={6}>
                    {step.title && (
                      <Title order={3} size="lg" fw={500}>
                        {step.title}
                      </Title>
                    )}
                    {step.subtext && (
                      <Text c="dimmed" size="xs">
                        {step.subtext}
                      </Text>
                    )}
                  </Stack>
                  {step.amount !== null && (
                    <Text size="sm" c="dimmed">
                      Available amount:&nbsp;
                      <Text component="span" c="black" fw={500}>
                        <CurrencyFormatter value={step.amount} />
                      </Text>
                      &nbsp;{step.is_approx_amount && "appx."}
                    </Text>
                  )}
                </Box>
              </Group>
              {!!step.children?.length && (
                <RecursiveTimeline steps={step.children} />
              )}
            </Card>

            {!isLast && (
              <Group justify="center" mt="xs">
                <ThemeIcon variant="transparent" color="black">
                  <ArrowDown size={20} />
                </ThemeIcon>
              </Group>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
