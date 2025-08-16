import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";

import {
  FinancialCard,
  FinancialCardSkeleton,
} from "#/components/shared/financial-card";
import { Section } from "#/components/shared/section";
import { useCategoryDetailsLoaderData } from "#/routes/private/category-details";

export default function FundPerformance() {
  const { schemes } = useCategoryDetailsLoaderData();

  return (
    <Section title="Fund Performance">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(4).keys()).map((item) => (
            <FinancialCardSkeleton key={item} />
          ))}
        >
          {schemes.map((scheme) => (
            <FinancialCard
              key={scheme.scheme_name}
              data={{
                current: scheme.current,
                invested: scheme.invested,
                returns: scheme.returns,
                returns_percentage: scheme.returns_percentage,
              }}
              icon={scheme.logo || ""}
              iconAlt={scheme.scheme_name as string}
              title={scheme.scheme_name || ""}
              subtitle={scheme.sub_category}
              additionalStats={[
                {
                  label: "Monthly SIP",
                  value: Number(scheme.monthly_sip),
                },
              ]}
            />
          ))}
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
