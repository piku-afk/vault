import {
  Badge,
  Box,
  Card,
  Group,
  NumberFormatter,
  Progress,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";
import type { getSummaryBySavingsCategory } from "#/utils/getSummaryBySavingsCategory.server";

const calculateProgressValue = (current: number, invested: number): number => {
  return invested > 0 ? Math.min((current / invested) * 100, 150) : 0;
};

export function CategoryCard({
  category,
}: {
  category: Awaited<ReturnType<typeof getSummaryBySavingsCategory>>[number];
}) {
  const progressValue = calculateProgressValue(
    category.current,
    category.invested,
  );
  const isCategoryPositive = category.returns > 0;
  const returnColor = isCategoryPositive ? "teal" : "red";

  return (
    <Card withBorder>
      <Stack gap="md">
        <Group align="flex-start">
          <Box>
            <Text fw={600} size="lg">
              {category.name}
            </Text>
            <Text size="sm" c="dimmed">
              {category.schemes_count}{" "}
              {category.schemes_count === 1 ? "Scheme" : "Schemes"}
            </Text>
          </Box>
          <Badge ml="auto" variant="light" color={returnColor} size="lg">
            <NumberFormatter
              value={category.returns_percentage}
              suffix="%"
              decimalScale={2}
              allowNegative={false}
              prefix={isCategoryPositive ? "+" : "-"}
            />
          </Badge>
        </Group>

        <Progress
          value={progressValue}
          color={returnColor}
          size="sm"
          radius="xl"
        />

        <SimpleGrid cols={3} spacing="xs">
          <Box>
            <Text size="xs" c="dimmed" mb={2}>
              Current
            </Text>
            <Text fw={500} size="sm">
              <CurrencyFormatter value={category.current} />
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed" mb={2}>
              Invested
            </Text>
            <Text fw={500} size="sm">
              <CurrencyFormatter value={category.invested} />
            </Text>
          </Box>

          <Box>
            <Text size="xs" c="dimmed" mb={2}>
              Returns
            </Text>
            <Text fw={500} size="sm" c={returnColor}>
              <CurrencyFormatter
                value={category.returns}
                allowNegative={false}
                prefix={isCategoryPositive ? "+" : "-"}
              />
            </Text>
          </Box>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
