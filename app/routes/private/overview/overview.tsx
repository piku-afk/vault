import { Divider, Stack } from "@mantine/core";

import { Goals } from "#/components/overview/goals";
import { Summary } from "#/components/overview/summary";
import { getFundsData } from "#/utils/getFunds.server";
import { getSummaryData } from "#/utils/getSummaryData.server";

export async function loader() {
  const overview = await getSummaryData();
  const funds = await getFundsData();

  return { overview, funds };
}

export default function Overview() {
  return (
    <Stack gap="xl" pb="xl">
      <Summary />
      <Divider />
      <Goals />
    </Stack>
  );
}
