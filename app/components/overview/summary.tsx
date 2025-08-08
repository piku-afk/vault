import { SimpleGrid } from "@mantine/core";
import { useLoaderData } from "react-router";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { InfoCard } from "#/components/info-card";
import { Section } from "#/components/section";
import type { loader } from "#/routes/private/overview/overview";

export function Summary() {
  const {
    overview: { net_worth, net_invested, net_returns, net_returns_percentage },
  } = useLoaderData<typeof loader>();

  return (
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
  );
}
