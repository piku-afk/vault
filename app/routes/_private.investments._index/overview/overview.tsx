import { NumberFormatter, SimpleGrid } from "@mantine/core";
import { useLoaderData } from "react-router";

import type { loader } from "#/routes/_private.investments._index/route";
import { formatCurrency } from "#/utils/currencyFormat";
import { CurrencyFormatter } from "../currenyFormatter";
import { Section } from "../section";
import { SummaryCard } from "./summaryCard";

export function Overview() {
  const {
    overview: { net_worth, net_invested, net_returns, net_returns_percentage },
  } = useLoaderData<typeof loader>();

  return (
    <Section title="Overview">
      <SimpleGrid cols={{ base: 1, xs: 3 }}>
        <SummaryCard
          title="Net Worth"
          value={<CurrencyFormatter value={net_worth} />}
        />
        <SummaryCard
          title="Net Invested"
          value={<CurrencyFormatter value={net_invested} />}
        />
        <SummaryCard
          title="Returns"
          value={
            <CurrencyFormatter
              prefix={`₹ ${net_returns > 0 ? "+" : "-"}`}
              value={net_returns}
            />
          }
        />
      </SimpleGrid>
    </Section>
  );
}
