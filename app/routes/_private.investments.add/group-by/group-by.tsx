import { SimpleGrid } from '@mantine/core';
import { Section } from '#/routes/_private.investments._index/section';
import { DateField } from '../date-field';
import { useTransactionForm } from '../transaction-form-context';

export function GroupBy() {
  const form = useTransactionForm();

  return (
    <Section title='Group By'>
      <SimpleGrid cols={{ base: 1, xs: 3 }}>
        <DateField clearable {...form.getInputProps('group_date')} />
      </SimpleGrid>
    </Section>
  );
}
