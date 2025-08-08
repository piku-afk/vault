import { Card, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";

export function InfoCard(props: { title: string; value: ReactNode }) {
  return (
    <Card withBorder bg="violet.0">
      <Text size="sm" mb={6}>
        {props.title}
      </Text>
      <Title order={3} fw="500">
        {props.value}
      </Title>
    </Card>
  );
}
