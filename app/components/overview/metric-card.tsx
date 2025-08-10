import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  Text,
  Title,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";

export function MetricCard(props: {
  label: string;
  badgeText: string;
  badgeColor: string;
  value: number;
  description: string;
  prefix?: string;
  percentageValue?: number;
}) {
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
      <Group mt="xs" gap="xs" align="center">
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
