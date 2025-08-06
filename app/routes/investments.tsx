import { Container, Divider, Stack } from '@mantine/core';

import { Overview } from '#/components/overview/overview';

export default function Investments() {
  return (
    <Container w='100%' size='md'>
      <Stack gap='xl'>
        <Overview />
        <Divider />
      </Stack>
    </Container>
  );
}
