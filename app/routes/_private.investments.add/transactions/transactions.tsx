import { Button } from '@mantine/core';
import { Plus } from 'lucide-react';

import { Section } from '../../_private.investments._index/section';

export function Transactions() {
  return (
    <Section title='Transactions'>
      <Button display='block' ml='auto' variant='light' leftSection={<Plus size={16} />}>
        Add transaction
      </Button>
    </Section>
  );
}
