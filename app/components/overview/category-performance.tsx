import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/section";
import type { getSummaryBySavingsCategory } from "#/utils/getSummaryBySavingsCategory.server";

import { CategoryCard, CategoryCardSkeleton } from "./category-card";

export function CategoryPerformance(props: {
  summaryBySavingsCategory: ReturnType<typeof getSummaryBySavingsCategory>;
}) {
  return (
    <Section title="Category Performance">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(4).keys()).map((item) => (
            <CategoryCardSkeleton key={item} />
          ))}
        >
          <Await resolve={props.summaryBySavingsCategory}>
            {(summaryBySavingsCategory) =>
              summaryBySavingsCategory.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))
            }
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
