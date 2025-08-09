import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  Progress,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";

interface CategorySummary {
  name: string;
  invested: number;
  current: number;
  returns: number;
  returns_percentage: number;
}

interface CategoryPerformanceProps {
  summaryBySavingsCategory: CategorySummary[];
}

export function CategoryPerformance({
  summaryBySavingsCategory,
}: CategoryPerformanceProps) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
      {summaryBySavingsCategory.map((category) => {
        const categoryReturn = category.returns;
        const categoryIsPositive = categoryReturn > 0;
        const progressValue =
          category.invested > 0
            ? Math.min((category.current / category.invested) * 100, 150)
            : 0;

        return (
          <Card key={category.name} withBorder radius="lg" p="lg">
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text fw={600} size="lg">
                    {category.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Investment category
                  </Text>
                </div>
                <Badge
                  variant="light"
                  color={categoryIsPositive ? "teal" : "red"}
                  size="lg"
                >
                  <NumberFormatter
                    value={Math.abs(category.returns_percentage)}
                    suffix="%"
                    decimalScale={1}
                    prefix={categoryIsPositive ? "+" : "-"}
                  />
                </Badge>
              </Group>

              <Progress
                value={progressValue}
                color={categoryIsPositive ? "teal" : "red"}
                size="sm"
                radius="xl"
              />

              <SimpleGrid cols={3} spacing="xs">
                <div>
                  <Text size="xs" c="dimmed" mb={2}>
                    Invested
                  </Text>
                  <Text fw={600} size="sm">
                    <CurrencyFormatter value={category.invested} />
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={2}>
                    Current
                  </Text>
                  <Text fw={600} size="sm">
                    <CurrencyFormatter value={category.current} />
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={2}>
                    Returns
                  </Text>
                  <Text
                    fw={600}
                    size="sm"
                    c={categoryIsPositive ? "teal.7" : "red.7"}
                  >
                    <CurrencyFormatter
                      value={Math.abs(categoryReturn)}
                      prefix={categoryIsPositive ? "+₹" : "-₹"}
                    />
                  </Text>
                </div>
              </SimpleGrid>
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
