import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { TrendingDown, TrendingUp } from "lucide-react";

import { ReturnsPercentageBadge } from "./returns-percentage-badge";

export function MonthlyPerformanceCard({
  scheme,
  variant,
}: {
  scheme: {
    sub_text?: string | null;
    scheme_name: string | null;
    nav_diff_percentage: number | null;
  };
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
            <ReturnsPercentageBadge
              value={scheme.nav_diff_percentage || 0}
              badgeProps={{ size: "xs" }}
            />
          </Group>
        </Group>
        {scheme.sub_text && (
          <Text size="xs" c="dimmed" style={{ flex: 1 }}>
            {scheme.sub_text}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
