import { Box, Title } from '@mantine/core';
import type { PropsWithChildren } from 'react';

export function Section(props: PropsWithChildren & { title: string }) {
  return (
    <Box component='section'>
      <Title order={2} mb='md' fw='normal'>
        {props.title}
      </Title>

      {props.children}
    </Box>
  );
}
