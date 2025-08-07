import { Card, Text, Title } from "@mantine/core";

export function SummaryCard(props: { title: string; value: string }) {
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
