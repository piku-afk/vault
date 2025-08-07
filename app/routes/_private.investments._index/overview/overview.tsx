import { SimpleGrid } from "@mantine/core";
import { useLoaderData } from "react-router";

import type { loader } from "#/routes/_private.investments._index/route";
import { formatCurrency } from "#/utils/currencyFormat";
import { Section } from "../section";
import { SummaryCard } from "./summaryCard";

export function Overview() {
  const { net_worth, net_invested, net_returns } =
    useLoaderData<typeof loader>();

  return (
    <Section title="Overview">
      <SimpleGrid cols={{ base: 1, xs: 3 }}>
        <SummaryCard title="Net Worth" value={formatCurrency(net_worth)} />
        <SummaryCard
          title="Net Invested"
          value={formatCurrency(net_invested)}
        />
        <SummaryCard title="Returns" value={formatCurrency(net_returns)} />
        {/* <SummaryCard title='XIRR' value='000' /> */}
      </SimpleGrid>
    </Section>
  );
}
