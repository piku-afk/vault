import {
  Badge,
  Card,
  Group,
  NumberFormatter,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { Fragment, Suspense } from "react";
import { Await } from "react-router";

import {
  getReturnsColor,
  getReturnsPrefix,
  isPositiveReturns,
} from "#/utils/financialHelpers";

import { CurrencyFormatter } from "../shared/currency-formatter";
import { Section } from "../shared/section";

export function SummarySection(props: {
  title: string;
  data: Promise<{
    xirr: number;
    net_invested: number;
    net_current: number;
    net_returns: number;
    net_returns_percentage: number;
  }>;
}) {
  return (
    <Section title={props.title}>
      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(3).keys()).map((item) => (
            <Card withBorder key={item}>
              <Group mb="md" justify="space-between">
                <Skeleton height={14} width={120} />
                <Skeleton height={18} width={60} />
              </Group>
              <Skeleton height={28} width="70%" />
              <Skeleton mt="md" height={12} width={120} />
            </Card>
          ))}
        >
          <Await resolve={props.data}>
            {(summary) => {
              const isPositiveReturn = isPositiveReturns(summary.net_returns);
              const returnsColor = getReturnsColor(summary.net_returns);
              const returnsPrefix = getReturnsPrefix(summary.net_returns);

              const metrics = [
                {
                  label: "Net Current",
                  badgeText: "Total",
                  badgeColor: "gray",
                  value: summary.net_current,
                  description: "Current portfolio value",
                },
                {
                  label: "Net Invested",
                  badgeText: "Principal",
                  badgeColor: "gray",
                  value: summary.net_invested,
                  description: "Total amount invested",
                },
                {
                  label: "Net Returns",
                  badgeText: isPositiveReturn ? "Profit" : "Loss",
                  badgeColor: returnsColor,
                  value: summary.net_returns,
                  prefix: summary.net_returns > 0 ? returnsPrefix : undefined,
                  description: (
                    <Fragment>
                      <Text component="span" size="xs" c={returnsColor}>
                        <NumberFormatter
                          value={Math.abs(summary.net_returns_percentage)}
                          suffix="%"
                          decimalScale={2}
                          prefix={returnsPrefix}
                        />
                      </Text>
                      &nbsp;return rate
                    </Fragment>
                  ),
                },
                // {
                //   label: "XIRR",
                //   badgeText: isPositiveReturn ? "Profit" : "Loss",
                //   badgeColor: returnsColor,
                //   value: summary.xirr,
                //   description: "Compound Annual Growth Rate",
                // },
              ];

              return metrics.map((metric) => (
                <Card withBorder key={metric.label}>
                  <Group mb="sm" justify="space-between" align="flex-start">
                    <Text size="sm">{metric.label}</Text>
                    <Badge variant="light" size="sm" color={metric.badgeColor}>
                      {metric.badgeText}
                    </Badge>
                  </Group>
                  <Title order={2} fw={500}>
                    <CurrencyFormatter
                      value={metric.value}
                      prefix={metric.prefix}
                    />
                  </Title>
                  <Group mt={6} gap="xs" align="center">
                    <Text size="xs" c="dimmed">
                      {metric.description}
                    </Text>
                  </Group>
                </Card>
              ));
            }}
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
