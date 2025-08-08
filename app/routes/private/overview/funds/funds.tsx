import { NumberFormatter, Table } from "@mantine/core";
import { useLoaderData } from "react-router";
import { Section } from "../../../components/section";
import type { loader } from "../overview";

export function Funds() {
  const { funds } = useLoaderData<typeof loader>();

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
              <Table.Tr key={fund.fund_name}>
                <Table.Td fw={500}>{fund.fund_name}</Table.Td>
                <Table.Td ta="right">
                  <NumberFormatter
                    value={fund.current}
                    prefix="₹ "
                    thousandSeparator
                    thousandsGroupStyle="lakh"
                    decimalScale={2}
                  />
                </Table.Td>
                <Table.Td ta="right">
                  <NumberFormatter
                    value={fund.invested}
                    prefix="₹ "
                    thousandSeparator
                    thousandsGroupStyle="lakh"
                    decimalScale={2}
                  />
                </Table.Td>
                <Table.Td
                  ta="right"
                  fw={600}
                  c={fund.returns > 0 ? "teal" : "red"}
                >
                  <NumberFormatter
                    value={fund.returns}
                    prefix="₹ "
                    thousandSeparator
                    thousandsGroupStyle="lakh"
                    decimalScale={2}
                  />
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
