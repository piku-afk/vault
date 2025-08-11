import { PieChart, type PieChartCell } from "@mantine/charts";
import {
  Card,
  Group,
  List,
  ListItem,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";

import type { getCategoryAllocation } from "#/utils/getPortfolioAnalytics.server";

export function AllocationChart(props: {
  categoryAllocation: Awaited<ReturnType<typeof getCategoryAllocation>>;
}) {
  const data: PieChartCell[] = props.categoryAllocation.map((item) => ({
    value: +item.allocation_percentage,
    name: item.name,
    color: `${item.color}.5`,
  }));

  return (
    <Card withBorder>
      <Stack align="center">
        <PieChart
          size={260}
          withLabels
          withLabelsLine
          labelsPosition="inside"
          labelsType="value"
          valueFormatter={(value) => `${value}%`}
          data={data}
        />
        <Group
          mt="xs"
          justify="space-between"
          gap="xs"
          component={List}
          wrap="nowrap"
        >
          {props.categoryAllocation.map((item) => (
            <ListItem key={item.name} style={{ flexShrink: 0 }}>
              <Group gap="xs">
                <ThemeIcon size="xs" color={item.color} />
                <Text size="xs">{item.name}</Text>
              </Group>
            </ListItem>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}
