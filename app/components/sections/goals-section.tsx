import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import type { getNetCurrentGoal } from "#/database/get-net-current-goal";
import type { getOverview } from "#/database/get-overview.server";

import { GoalCard, GoalCardSkeleton } from "../shared/goal-card";
import { Section } from "../shared/section";

export function GoalsSection(props: {
  title: string;
  data: ReturnType<typeof getOverview>["goals"];
  netCurrentGoal: ReturnType<typeof getNetCurrentGoal>;
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
              goals.map((goal) => <GoalCard key={goal.name} goal={goal} />)
            }
          </Await>
          <Await resolve={props.netCurrentGoal}>
            {/** biome-ignore lint/style/noNonNullAssertion: netCurrent is be defined */}
            {(netCurrentGoal) => <GoalCard goal={netCurrentGoal!} />}
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
