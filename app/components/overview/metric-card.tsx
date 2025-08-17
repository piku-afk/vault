import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  badgeText: string;
  badgeColor: string;
  value: number;
  description: ReactNode;
  prefix?: string;
}

export function MetricCard(props: MetricCardProps) {
  return (
    <Card withBorder>
      <Group mb="sm" justify="space-between" align="flex-start">
        <Text size="sm">{props.label}</Text>
        <Badge variant="light" size="sm" color={props.badgeColor}>
          {props.badgeText}
        </Badge>
      </Group>
      <Title order={2} fw={500}>
        <CurrencyFormatter value={props.value} prefix={props.prefix} />
      </Title>
      <Group mt={6} gap="xs" align="center">
        <Text size="xs" c="dimmed">
          {props.description}
        </Text>
      </Group>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <Card withBorder>
      <Group mb="md" justify="space-between">
        <Skeleton height={14} width={120} />
        <Skeleton height={18} width={60} />
      </Group>
      <Skeleton height={28} width="70%" />
      <Skeleton mt="md" height={12} width={120} />
    </Card>
  );
}
