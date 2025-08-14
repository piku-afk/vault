import { PieChart, type PieChartCell } from "@mantine/charts";
import {
  Card,
  Group,
  List,
  ListItem,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { use } from "react";

import { useOverviewLoaderData } from "#/routes/private/overview";

export function AllocationChart() {
  const { categoryAllocation } = useOverviewLoaderData();
  const categoryAllocationData = use(categoryAllocation);

  const data: PieChartCell[] = categoryAllocationData.map((item) => ({
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
          {categoryAllocationData.map((item) => (
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

export function AllocationChartSkeleton() {
  return (
    <Card withBorder>
      <Stack align="center">
        <Skeleton circle height={260} width={260} />
        <Group
          mt="xs"
          justify="space-between"
          gap="xs"
          component={List}
          wrap="nowrap"
        >
          {Array.from(Array(4).keys()).map((item) => (
            <ListItem key={item} style={{ flexShrink: 0 }}>
              <Group gap="xs">
                <Skeleton height={18} width={18} />
                <Skeleton height={12} width={60} />
              </Group>
            </ListItem>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}
