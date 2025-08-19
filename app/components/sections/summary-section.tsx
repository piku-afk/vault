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
import { Fragment, type RefObject, Suspense } from "react";
import { Await } from "react-router";

import type { getOverview } from "#/database/get-overview.server";
import type { getXIRR } from "#/database/get-xirr.server";
import { useInContainer } from "#/hooks/use-in-container";
import {
  getReturnsColor,
  getReturnsPrefix,
  isPositiveReturns,
} from "#/utils/financialHelpers";

import { CurrencyFormatter } from "../shared/currency-formatter";
import { Section } from "../shared/section";

export function SummarySection(props: {
  title: string;
  data: ReturnType<typeof getOverview>["summary"];
  xirr: ReturnType<typeof getXIRR>;
}) {
  const { isInContainer: isInDialog, ref } = useInContainer("dialog");
  ("dialog");

  return (
    <Section ref={ref as RefObject<HTMLDivElement>} title={props.title}>
      <SimpleGrid cols={{ base: 1, xs: isInDialog ? 2 : 4 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(3).keys()).map((item) => (
            <Card withBorder key={item}>
              <Group mb="md" justify="space-between">
                <Skeleton height={14} width={100} />
                <Skeleton height={18} width={40} />
              </Group>
              <Skeleton height={28} width="70%" />
              <Skeleton mt="md" height={12} width={120} />
            </Card>
          ))}
        >
          <Await resolve={props.data}>
            {(summary) => {
              const isPositiveReturn = isPositiveReturns(
                Number(summary.net_returns),
              );
              const returnsColor = getReturnsColor(Number(summary.net_returns));
              const returnsPrefix = getReturnsPrefix(
                Number(summary.net_returns),
              );

              return [
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
                  prefix:
                    Number(summary.net_returns) > 0 ? returnsPrefix : undefined,
                  description: (
                    <Fragment>
                      <Text component="span" size="xs" c={returnsColor}>
                        <NumberFormatter
                          value={Math.abs(
                            Number(summary.net_returns_percentage),
                          )}
                          suffix="%"
                          decimalScale={2}
                          prefix={returnsPrefix}
                        />
                      </Text>
                      &nbsp;return rate
                    </Fragment>
                  ),
                },
              ].map((metric) => (
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

        <Suspense
          fallback={
            <Card withBorder>
              <Group mb="md" justify="space-between">
                <Skeleton height={14} width={100} />
                <Skeleton height={18} width={40} />
              </Group>
              <Skeleton height={28} width="70%" />
              <Skeleton mt="md" height={12} width={120} />
            </Card>
          }
        >
          <Await resolve={props.xirr}>
            {(xirr) =>
              [
                {
                  label: "XIRR",
                  badgeText: xirr.summary ? "Profit" : "Loss",
                  badgeColor: getReturnsColor(xirr.summary),
                  value: xirr.summary,
                  description: "Annualized return rate",
                  prefix:
                    Number(xirr.summary) > 0
                      ? getReturnsPrefix(xirr.summary)
                      : undefined,
                },
              ].map((metric) => (
                <Card withBorder key={metric.label}>
                  <Group mb="sm" justify="space-between" align="flex-start">
                    <Text size="sm">{metric.label}</Text>
                    <Badge variant="light" size="sm" color={metric.badgeColor}>
                      {metric.badgeText}
                    </Badge>
                  </Group>
                  <Title order={2} fw={500} c={metric.badgeColor}>
                    <CurrencyFormatter
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix="%"
                    />
                  </Title>
                  <Group mt={6} gap="xs" align="center">
                    <Text size="xs" c="dimmed">
                      {metric.description}
                    </Text>
                  </Group>
                </Card>
              ))
            }
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
