import { SimpleGrid } from "@mantine/core";
import { Await } from "react-router";

import { Section } from "#/components/section";
import type { getCategoryAllocation } from "#/utils/getPortfolioAnalytics.server";

import { AllocationChart } from "./allocation-chart";

export function PortfolioDiversification(props: {
  categoryAllocation: ReturnType<typeof getCategoryAllocation>;
}) {
  return (
    <Section title="Portfolio Diversification">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Await resolve={props.categoryAllocation}>
          {(categoryAllocation) => (
            <AllocationChart categoryAllocation={categoryAllocation} />
          )}
        </Await>
      </SimpleGrid>
    </Section>
  );
}
