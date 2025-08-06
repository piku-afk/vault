import { Divider, Stack } from '@mantine/core';

import { Overview } from '#/components/overview/overview';
import { createClient } from '#/utils/supabase.server';

import type { Route } from './+types/_private.investments._index';

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);
  // await supabase.from('transaction_type').select().filter('name', 'eq', '')

  const netInvested = await supabase
    .from('transaction')
    .select('amount.sum()')
    .filter('transaction_type', 'eq', 'PURCHASE');
  console.log('Net Invested:', netInvested);

  return { netInvested: netInvested?.data?.[0]?.sum || 0 };
}

export default function Investments() {
  return (
    <Stack gap='xl'>
      <Overview />
      <Divider />
    </Stack>
  );
}
