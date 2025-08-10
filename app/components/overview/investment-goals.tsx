import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import { Section } from "#/components/section";
import type { getGoalProgress } from "#/utils/getGoals.server";

import { GoalCard, GoalCardSkeleton } from "./goal-card";

export function InvestmentGoals(props: {
  goalProgress: ReturnType<typeof getGoalProgress>;
}) {
  return (
    <Section title="Investment Goals">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(2).keys()).map((item) => (
            <GoalCardSkeleton key={item} />
          ))}
        >
          <Await resolve={props.goalProgress}>
            {(goalProgress) =>
              goalProgress.map((goal) => (
                <GoalCard key={goal.name} goal={goal} />
              ))
            }
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
