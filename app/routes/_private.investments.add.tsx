import { Button, Card, Grid, Group, Select, TextInput, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect } from 'react';
import { Form, useSubmit } from 'react-router';
import { z } from 'zod/v4';
import { createClient } from '#/utils/supabase.server';
import type { Route } from './+types/_private.investments.add';

dayjs.extend(customParseFormat);

const transactionSchema = z.object({
  date: z.string().refine(
    (val) => {
      return dayjs(val, 'YYYY-MM-DD', true).isValid();
    },
    {
      message: 'Invalid date format. Use YYYY-MM-DD',
    }
  ),
  transaction_type: z.string(),
  fund_name: z.string(),
  units: z.coerce.number().positive(),
  nav: z.coerce.number().positive(),
  amount: z.coerce.number().positive(),
});

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = createClient(request);
  const formData: z.infer<typeof transactionSchema> = await request.json();

  const { error } = await supabase.from('transaction').insert(formData);

  if (error) {
    throw new Response(error.message, { status: 400 });
  }

  return true;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);

  const transactionTypes = await supabase.from('transaction_type').select();
  const fundTypes = await supabase.from('mutual_fund').select();

  return {
    transactionTypes: transactionTypes.data?.map((item) => item.name) || [],
    fundTypes: fundTypes.data?.map((item) => item.fund_name) || [],
  };
}

export default function InvestmentsAdd({ loaderData, actionData }: Route.ComponentProps) {
  const { transactionTypes, fundTypes } = loaderData;
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    validate: zod4Resolver(transactionSchema),
  });

  useEffect(() => {
    if (actionData) {
      form.reset();
    }
  }, [actionData, form.reset]);

  function handleSubmit(values: Record<string, unknown>) {
    submit(values as z.infer<typeof transactionSchema>, {
      method: 'post',
      encType: 'application/json',
    });
  }

  return (
    <Form method='post' onSubmit={form.onSubmit(handleSubmit)}>
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
    </Form>
  );
}
