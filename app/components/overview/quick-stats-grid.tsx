import { Card, Group, SimpleGrid, Text, ThemeIcon } from "@mantine/core";
import { Building2, Clock, DollarSign, TrendingUp } from "lucide-react";

import { CurrencyFormatter } from "#/components/currency-formatter";

interface QuickStatsGridProps {
  quickStats: {
    totalSchemes: number;
    averageMonthlySip: number;
    daysSinceLastTransaction: number;
  };
  bestPerformer?: {
    category: string;
    returnsPercentage: number;
  };
}

export function QuickStatsGrid({
  quickStats,
  bestPerformer,
}: QuickStatsGridProps) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
      <Card withBorder radius="md" p="md" bg="gray.0">
        <Group gap="sm">
          <ThemeIcon variant="light" color="blue" size="lg" radius="md">
            <Building2 size={20} />
          </ThemeIcon>
          <div>
            <Text size="xl" fw={700} c="blue.7">
              {quickStats.totalSchemes}
            </Text>
            <Text size="xs" c="dimmed">
              Total Schemes
            </Text>
          </div>
        </Group>
      </Card>

      <Card withBorder radius="md" p="md" bg="green.0">
        <Group gap="sm">
          <ThemeIcon variant="light" color="green" size="lg" radius="md">
            <DollarSign size={20} />
          </ThemeIcon>
          <div>
            <Text size="xl" fw={700} c="green.7">
              <CurrencyFormatter value={quickStats.averageMonthlySip} />
            </Text>
            <Text size="xs" c="dimmed">
              Avg Monthly SIP
            </Text>
          </div>
        </Group>
      </Card>

      {bestPerformer && (
        <Card withBorder radius="md" p="md" bg="teal.0">
          <Group gap="sm">
            <ThemeIcon variant="light" color="teal" size="lg" radius="md">
              <TrendingUp size={20} />
            </ThemeIcon>
            <div>
              <Text size="xl" fw={700} c="teal.7">
                +{bestPerformer.returnsPercentage.toFixed(1)}%
              </Text>
              <Text size="xs" c="dimmed">
                {bestPerformer.category}
              </Text>
            </div>
          </Group>
        </Card>
      )}

      <Card withBorder radius="md" p="md" bg="violet.0">
        <Group gap="sm">
          <ThemeIcon variant="light" color="violet" size="lg" radius="md">
            <Clock size={20} />
          </ThemeIcon>
          <div>
            <Text size="xl" fw={700} c="violet.7">
              {quickStats.daysSinceLastTransaction || 0}
            </Text>
            <Text size="xs" c="dimmed">
              Days Since Last
            </Text>
          </div>
        </Group>
      </Card>
    </SimpleGrid>
  );
}
