import { Box, SimpleGrid, Title } from '@mantine/core';
import { useLoaderData } from 'react-router';

import type { loader } from '#/routes/_private.investments._index';
import { formatCurrency } from '#/utils/currencyFormat';
import { SummaryCard } from './summaryCard';

export function Overview() {
  const { net_worth, net_invested, net_returns } = useLoaderData<typeof loader>();

  return (
    <Box component='section'>
      <Title order={2} fw='normal'>
        Overview
      </Title>
      <SimpleGrid mt='sm' cols={{ base: 1, xs: 3 }}>
        <SummaryCard title='Net Worth' value={formatCurrency(net_worth)} />
        <SummaryCard title='Net Invested' value={formatCurrency(net_invested)} />
        <SummaryCard title='Returns' value={formatCurrency(net_returns)} />
        {/* <SummaryCard title='XIRR' value='000' /> */}
      </SimpleGrid>
    </Box>
  );
}
