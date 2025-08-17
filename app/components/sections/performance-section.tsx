import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { Await } from "react-router";

import {
  PerformanceCard,
  PerformanceCardSkeleton,
} from "../shared/performance-card";
import { Section } from "../shared/section";

export function PerformanceSection(props: {
  title: string;
  data: Promise<
    {
      name: string;
      subtitle?: string;
      icon: string;
      iconAlt?: string;
      current: number;
      invested: number;
      returns: number;
      action_route?: string;
      returns_percentage: number;
      monthly_sip: number;
    }[]
  >;
}) {
  return (
    <Section title={props.title}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Suspense
          fallback={Array.from(Array(4).keys()).map((item) => (
            <PerformanceCardSkeleton key={item} />
          ))}
        >
          <Await resolve={props.data}>
            {(data) =>
              data.map((item) => (
                <PerformanceCard
                  key={item.name}
                  data={item}
                  icon={item.icon}
                  iconAlt={item.name}
                  title={item.name}
                  subtitle={item.subtitle}
                  actionRoute={item.action_route}
                />
              ))
            }
          </Await>
        </Suspense>
      </SimpleGrid>
    </Section>
  );
}
