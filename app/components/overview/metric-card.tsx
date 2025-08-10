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

interface MetricCardProps {
  label: string;
  badgeText: string;
  badgeColor: string;
  value: number;
  description: string;
  prefix?: string;
  percentageValue?: number;
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
          {props.percentageValue ? (
            <>
              <Text
                component="span"
                size="xs"
                c={props.value > 0 ? "teal" : "red"}
              >
                <NumberFormatter
                  value={Math.abs(props.percentageValue)}
                  suffix="%"
                  decimalScale={2}
                  prefix={props.value > 0 ? "+" : "-"}
                />
              </Text>
              &nbsp;return rate
            </>
          ) : (
            props.description
          )}
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
