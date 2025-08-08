import { SimpleGrid } from "@mantine/core";
import { useLoaderData } from "react-router";

import type { loader } from "#/routes/_private.overview._index/route";
import { Section } from "../../../components/section";
import { CurrencyFormatter } from "../currencyFormatter";
import { SummaryCard } from "./summaryCard";

export function Overview() {
  const {
    overview: { net_worth, net_invested, net_returns, net_returns_percentage },
  } = useLoaderData<typeof loader>();

  return (
    <Section>
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
  );
}
