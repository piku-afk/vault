import { SimpleGrid } from "@mantine/core";

import { Section } from "#/components/section";
import type { getSummaryBySavingsCategory } from "#/utils/getSummaryBySavingsCategory.server";

import { CategoryCard } from "./category-card";

export function CategoryPerformance({
  summaryBySavingsCategory,
}: {
  summaryBySavingsCategory: Awaited<
    ReturnType<typeof getSummaryBySavingsCategory>
  >;
}) {
  return (
    <Section title="Category Performance">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {summaryBySavingsCategory.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </SimpleGrid>
    </Section>
  );
}
