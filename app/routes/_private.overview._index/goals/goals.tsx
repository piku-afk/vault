import { SimpleGrid } from "@mantine/core";
import { Section } from "../../../components/section";
import { SummaryCard } from "../overview/summaryCard";

export function Goals() {
  return (
    <Section title="Goals">
      <SimpleGrid cols={{ base: 1, xs: 3 }}>
        <SummaryCard title="Emergency Fund" value="Target for Emergency Fund" />
        {/* <SummaryCard title='Bike Fund' value='Target for Bike Fund' /> */}
        {/* <SummaryCard title='Vacation Fund' value='Target for Vacation Fund' /> */}
      </SimpleGrid>
    </Section>
  );
}
