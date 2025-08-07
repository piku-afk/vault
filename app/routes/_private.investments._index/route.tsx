import { Divider, Stack } from "@mantine/core";

import { getOverviewData } from "#/utils/getOverviewData.server";
import { Funds } from "./funds/funds";
import { Goals } from "./goals/goals";
import { Overview } from "./overview/overview";

export async function loader() {
  const overview = await getOverviewData();

  return { overview };
}

export default function Investments() {
  return (
    <Stack gap="xl">
      <Overview />
      <Divider />
      <Goals />
      <Divider />
      <Funds />
    </Stack>
  );
}
