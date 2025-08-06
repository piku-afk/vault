import { Box, SimpleGrid, Title } from '@mantine/core';
import { useLoaderData } from 'react-router';
import { SummaryCard } from './summaryCard';

export function Overview() {
  const { netInvested } = useLoaderData();

  console.log('Net Invested:', netInvested);

  return (
    <Box component='section'>
      <Title order={2} fw='normal'>
        Overview
      </Title>
      <SimpleGrid mt='sm' cols={{ base: 1, xs: 4 }}>
        <SummaryCard title='Net Worth' value='000' />
        <SummaryCard title='Net Invested' value={netInvested.toFixed(2)} />
        <SummaryCard title='Returns' value='000' />
        <SummaryCard title='XIRR' value='000' />
      </SimpleGrid>
    </Box>
  );
}
