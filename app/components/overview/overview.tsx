import { Box, SimpleGrid, Title } from '@mantine/core';
import { SummaryCard } from './summaryCard';

export function Overview() {
  return (
    <Box component='section'>
      <Title order={2} fw='normal'>
        Overview
      </Title>
      <SimpleGrid mt='sm' cols={{ base: 1, xs: 4 }}>
        <SummaryCard title='Net Worth' value='000' />
        <SummaryCard title='Net Invested' value='000' />
        <SummaryCard title='Returns' value='000' />
        <SummaryCard title='XIRR' value='000' />
      </SimpleGrid>
    </Box>
  );
}
