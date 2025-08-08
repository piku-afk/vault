import { Divider, SimpleGrid, Stack, Text } from "@mantine/core";

import { CurrencyFormatter } from "#/components/currency-formatter";
import { InfoCard } from "#/components/info-card";
import { Section } from "#/components/section";
import { getSummaryData } from "#/utils/getSummaryData.server";

import type { Route } from "./+types/overview";

export async function loader() {
  return getSummaryData();
}

export default function Overview({ loaderData }: Route.ComponentProps) {
  const { net_invested, net_returns, net_returns_percentage, net_worth } =
    loaderData;

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

      <Text>
        A table displaying total invested, current and returns across different
        savings categories
      </Text>
    </Stack>
  );
}
