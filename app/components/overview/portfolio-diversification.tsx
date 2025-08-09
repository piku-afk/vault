import {
  Badge,
  Card,
  Group,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { PieChart } from "lucide-react";

import { CurrencyFormatter } from "#/components/currency-formatter";

interface DiversificationItem {
  category: string;
  percentage: number;
  invested: number;
}

interface PortfolioDiversificationProps {
  portfolioDiversification: DiversificationItem[];
}

const COLORS = [
  "#339af0",
  "#20c997",
  "#7950f2",
  "#fd7e14",
  "#51cf66",
  "#ff6b6b",
];

export function PortfolioDiversification({
  portfolioDiversification,
}: PortfolioDiversificationProps) {
  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
      {/* Diversification Chart */}
      <Card withBorder radius="lg" p="lg">
        <Group justify="center" mb="md">
          <ThemeIcon variant="light" color="indigo" size="lg" radius="md">
            <PieChart size={20} />
          </ThemeIcon>
          <Text fw={600} size="lg">
            Asset Allocation
          </Text>
        </Group>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <RingProgress
            size={200}
            thickness={20}
            sections={portfolioDiversification.map((item, index) => ({
              value: item.percentage,
              color: COLORS[index % 6],
              tooltip: `${item.category}: ${item.percentage.toFixed(1)}%`,
            }))}
            label={
              <Text size="xs" ta="center" fw={600} c="dimmed">
                {portfolioDiversification.length} Categories
              </Text>
            }
          />
        </div>

        <Stack gap="sm">
          {portfolioDiversification.map((item, index) => (
            <Group key={item.category} justify="space-between">
              <Group gap="xs">
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: COLORS[index % 6],
                  }}
                />
                <Text size="sm" fw={500}>
                  {item.category}
                </Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" fw={600} c="dimmed">
                  {item.percentage.toFixed(1)}%
                </Text>
                <Text size="xs" c="dimmed">
                  <CurrencyFormatter value={item.invested} />
                </Text>
              </Group>
            </Group>
          ))}
        </Stack>
      </Card>

      {/* Allocation Insights */}
      <Card withBorder radius="lg" p="lg">
        <Text fw={600} size="lg" mb="lg">
          Allocation Insights
        </Text>

        <Stack gap="lg">
          {/* Largest Allocation */}
          {portfolioDiversification.length > 0 && (
            <div>
              <Text size="sm" c="dimmed" mb="xs">
                Largest Allocation
              </Text>
              <Group justify="space-between">
                <Text fw={600}>{portfolioDiversification[0]?.category}</Text>
                <Badge variant="light" color="blue" size="lg">
                  {portfolioDiversification[0]?.percentage.toFixed(1)}%
                </Badge>
              </Group>
            </div>
          )}

          {/* Diversification Score */}
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Diversification Score
            </Text>
            <Group align="center" gap="md">
              <Progress
                value={Math.min(portfolioDiversification.length * 20, 100)}
                color={
                  portfolioDiversification.length >= 4
                    ? "teal"
                    : portfolioDiversification.length >= 2
                      ? "yellow"
                      : "red"
                }
                size="lg"
                radius="xl"
                style={{ flex: 1 }}
              />
              <Text fw={600} size="sm">
                {portfolioDiversification.length >= 4
                  ? "Good"
                  : portfolioDiversification.length >= 2
                    ? "Fair"
                    : "Low"}
              </Text>
            </Group>
            <Text size="xs" c="dimmed" mt="xs">
              Based on {portfolioDiversification.length} categories
            </Text>
          </div>

          {/* Recommendation */}
          <div>
            <Text size="sm" c="dimmed" mb="xs">
              Recommendation
            </Text>
            <Text size="sm">
              {portfolioDiversification.length < 3
                ? "Consider diversifying across more asset categories for better risk management."
                : portfolioDiversification[0]?.percentage > 60
                  ? "Your portfolio is heavily concentrated. Consider rebalancing."
                  : "Your portfolio shows good diversification across categories."}
            </Text>
          </div>
        </Stack>
      </Card>
    </SimpleGrid>
  );
}
