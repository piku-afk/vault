import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { TrendingDown, TrendingUp } from "lucide-react";

export function MonthlyPerformanceCard({
  scheme,
  variant,
}: {
  scheme: {
    saving_category: string | null;
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
