import { Button, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Fragment } from 'react';
import { useSubmit } from 'react-router';
import { z } from 'zod/v4';

Component.displayName = 'TwoFactor';

export function action() {
  // This action is intentionally left empty as the two-factor page does not handle any actions.
  return null;
}

const twoFactorSchema = z.object({
  code: z.string().min(6, { error: 'Code must be at least 6 characters long' }).default(''),
});

// #TODO: Implement two-factor authentication using Supabase M2FA
export function Component() {
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    validate: zod4Resolver(twoFactorSchema),
    initialValues: twoFactorSchema.parse({}),
  });

  function handleSubmit(values: z.infer<typeof twoFactorSchema>) {
    submit(values, { method: 'post', encType: 'application/json' });
  }

  return (
    <Fragment>
      <Title mt='xl' order={1} fw={500} ta='center'>
        Two-factor Authentication
      </Title>
      <Title order={2} size='h4' mt='xs' mb='xl' fw={400} ta='center'>
        Enter the code from your two-factor authentication app below.
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          type='text'
          placeholder='XXXXXX'
          styles={{ input: { textAlign: 'center' } }}
          {...form.getInputProps('code')}
        />

        <Button type='submit' fullWidth mt='xl'>
          Sign In
        </Button>
      </form>
    </Fragment>
  );
}
