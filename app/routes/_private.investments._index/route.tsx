import { Divider, Stack } from "@mantine/core";

import { getFundsData } from "#/utils/getFunds.server";
import { getOverviewData } from "#/utils/getOverviewData.server";

import { Funds } from "./funds/funds";
import { Goals } from "./goals/goals";
import { Overview } from "./overview/overview";

export async function loader() {
  const overview = await getOverviewData();
  const funds = await getFundsData();

  return { overview, funds };
}

export default function Investments() {
  return (
    <Stack gap="xl" pb="xl">
      <Overview />
      <Divider />
      <Goals />
      <Divider />
      <Funds />
    </Stack>
  );
}
