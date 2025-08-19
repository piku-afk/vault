import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import type { getGoalsProgress } from "#/database/get-goals-progress";

import { GoalCard, GoalCardSkeleton } from "../shared/goal-card";
import { Section } from "../shared/section";

export function GoalsSection(props: {
  title: string;
  data: ReturnType<typeof getGoalsProgress>;
}) {
  return (
    <Section title={props.title}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(3).keys()).map((item) => (
            <GoalCardSkeleton key={item} />
          ))}
        >
          <Await resolve={props.data}>
            {(goals) =>
              goals.map((goal) =>
                goal ? <GoalCard key={goal.name} goal={goal} /> : null,
              )
            }
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
