import { NumberFormatter, Table } from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { Section } from "#/components/section";
import { getInvestmentData } from "#/utils/getInvestment.server";

import type { Route } from "./+types/investments";

export async function loader() {
  return getInvestmentData();
}

export default function Investments({ loaderData }: Route.ComponentProps) {
  const funds = loaderData;

  return (
    <Section title="Funds">
      <Table.ScrollContainer minWidth="48em">
        <Table withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Scheme Name</Table.Th>
              <Table.Th ta="right">Current</Table.Th>
              <Table.Th ta="right">Invested</Table.Th>
              <Table.Th ta="right">Returns</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {funds.map((fund) => (
              <Table.Tr key={fund.scheme_name}>
                <Table.Td fw={500}>{fund.scheme_name}</Table.Td>
                <Table.Td ta="right">
                  <CurrencyFormatter value={fund.current} />
                </Table.Td>
                <Table.Td ta="right">
                  <CurrencyFormatter value={fund.invested} />
                </Table.Td>
                <Table.Td
                  ta="right"
                  fw={600}
                  c={fund.returns > 0 ? "teal" : "red"}
                >
                  <CurrencyFormatter value={fund.returns} />
                  &nbsp;(
                  <NumberFormatter
                    value={fund.returns_percentage}
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
  );
}
