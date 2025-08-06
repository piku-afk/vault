import { Button, Card, Divider, Grid, Group, Select, TextInput, Title } from '@mantine/core';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useFetcher, useSubmit } from 'react-router';

import { db } from '#/utils/kysely.server';
import {
  TransactionFormProvider,
  type TransactionFormValues,
  transactionSchema,
  useTransactionForm,
} from './form-context';

dayjs.extend(customParseFormat);

export async function action() {
  // const { supabase } = createClient(request);
  // const formData: z.infer<typeof transactionSchema> = await request.json();
  // const { error } = await supabase.from('transaction').insert(formData);
  // if (error) {
  //   throw new Response(error.message, { status: 400 });
  // }
  // return true;
}

export async function loader() {
  const fundTypes = await db.selectFrom('mutual_fund').select('fund_name').execute();
  const transactionTypes = await db.selectFrom('transaction_type').select('name').execute();

  return {
    fundTypes: fundTypes,
    transactionTypes: transactionTypes,
  };
}

export default function InvestmentsAdd() {
  const fetcher = useFetcher();
  const submit = useSubmit();
  const form = useTransactionForm({
    mode: 'uncontrolled',
    validate: zod4Resolver(transactionSchema),
  });

  function handleSubmit(values: Record<string, unknown>) {
    submit(values as TransactionFormValues, {
      method: 'post',
      encType: 'application/json',
    });
  }

  const isLoading = fetcher.state === 'submitting';

  return (
    <TransactionFormProvider form={form}>
      <fetcher.Form method='post' onSubmit={form.onSubmit(handleSubmit)}>
        <Title order={2} fw='normal'>
          Add transactions
        </Title>

        <Divider my='lg' />

        <Divider my='lg' />

        <Group justify='flex-end' gap='md'>
          <Button type='reset' variant='default' disabled={isLoading}>
            Reset
          </Button>
          <Button type='submit' variant='default' loading={isLoading}>
            Add Transaction
          </Button>
        </Group>
      </fetcher.Form>
    </TransactionFormProvider>
  );
}

{
  /* <Form method='post' onSubmit={form.onSubmit(handleSubmit)}>
      <Card withBorder bg='violet.0' p={{ base: 'md', xs: 'xl' }}>
        <Title order={2} fw='normal'>
          Add new transaction
        </Title>
        <Grid grow mt='xl' gutter='lg'>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <DateInput
              label='Date'
              placeholder='DD/MM/YYYY'
              valueFormat='DD/MM/YYYY'
              {...form.getInputProps('date')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Select
              label='Transaction Type'
              placeholder='Select transaction type'
              data={transactionTypes}
              {...form.getInputProps('transaction_type')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label='Fund Name'
              placeholder='Select fund name'
              data={fundTypes}
              {...form.getInputProps('fund_name')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <TextInput
              type='number'
              label='Units Allocated'
              placeholder='Enter the units allocated'
              {...form.getInputProps('units')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <TextInput
              type='number'
              label='NAV'
              placeholder='Enter NAV price'
              {...form.getInputProps('nav')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <TextInput
              type='number'
              label='Amount'
              placeholder='Enter the amount invested'
              step='0.01'
              {...form.getInputProps('amount')}
            />
          </Grid.Col>
        </Grid>
        <Group mt='xl' justify='flex-end' gap='md'>
          <Button type='submit' variant='default'>
            Add Transaction
          </Button>
          <Button type='reset' variant='default' onClick={() => form.reset()}>
            Reset
          </Button>
        </Group>
      </Card>
    </Form> */
}
