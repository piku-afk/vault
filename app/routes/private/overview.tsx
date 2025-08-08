import {
  Card,
  Divider,
  NumberFormatter,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { InfoCard } from "#/components/info-card";
import { Section } from "#/components/section";
import { getSummaryBySavingsCategory } from "#/utils/getSummaryBySavingsCategory";
import { getSummaryData } from "#/utils/getSummaryData.server";

import type { Route } from "./+types/overview";

export async function loader() {
  const summary = await getSummaryData();
  const summaryBySavingsCategory = await getSummaryBySavingsCategory();
  return { summary, summaryBySavingsCategory };
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const {
    summary: { net_invested, net_returns, net_returns_percentage, net_worth },
    summaryBySavingsCategory,
  } = loaderData;

  return (
    <Stack gap="xl" pb="xl">
      <Section title="Summary">
        <SimpleGrid cols={{ base: 1, xs: 3 }}>
          <InfoCard
            title="Net Worth"
            value={<CurrencyFormatter value={net_worth} />}
          />
          <InfoCard
            title="Net Invested"
            value={<CurrencyFormatter value={net_invested} />}
          />
          <InfoCard
            title="Returns"
            value={
              <>
                <CurrencyFormatter
                  prefix={`₹ ${net_returns > 0 ? "+" : "-"}`}
                  value={net_returns}
                />
                &nbsp;(
                <CurrencyFormatter suffix="%" value={net_returns_percentage} />)
              </>
            }
          />
        </SimpleGrid>
      </Section>

      <Divider />

      <Section title="Summary by Savings Category">
        <Table.ScrollContainer minWidth="sm">
          <Table withTableBorder>
            <Table.Thead bg="violet.0">
              <Table.Tr>
                <Table.Th>Savings Category</Table.Th>
                <Table.Th ta="right">Current</Table.Th>
                <Table.Th ta="right">Invested</Table.Th>
                <Table.Th ta="right">Returns</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {summaryBySavingsCategory.map((category) => (
                <Table.Tr key={category.name}>
                  <Table.Td>{category.name}</Table.Td>
                  <Table.Td ta="right">
                    <CurrencyFormatter value={category.current} />
                  </Table.Td>
                  <Table.Td ta="right">
                    <CurrencyFormatter value={category.invested} />
                  </Table.Td>
                  <Table.Td
                    ta="right"
                    c={category.returns > 0 ? "teal" : "red"}
                  >
                    <CurrencyFormatter value={category.returns} />
                    &nbsp;(
                    <NumberFormatter
                      value={category.returns_percentage}
                      suffix="%"
                      decimalScale={2}
                    />
                    )
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Section>
    </Stack>
  );
}
