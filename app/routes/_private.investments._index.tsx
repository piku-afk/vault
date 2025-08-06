import { Divider, Stack } from '@mantine/core';

import { Overview } from '#/components/overview/overview';

export default function Investments() {
  return (
    <Stack gap='xl'>
      <Overview />
      <Divider />
    </Stack>
  );
}
