import { Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createClient } from 'app/utils/supabase.server';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Fragment } from 'react';
import {
  type ActionFunctionArgs,
  Form,
  redirect,
  useLocation,
  useNavigation,
  useSubmit,
} from 'react-router';
import { z } from 'zod/v4';

import { showErrorNotification } from '#/utils/notification.ts';

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createClient(request);
  const formData = await request.json();

  const { data, error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    showErrorNotification(error.message);
  }

  if (data.session) {
    return redirect('/', { headers });
  }

  return null;
}

const loginSchema = z.object({
  email: z.email().default(''),
  password: z.string().min(8, { error: 'Password must be at least 8 characters long' }).default(''),
});

export default function Login() {
  const submit = useSubmit();
  const { pathname } = useLocation();
  const { formAction } = useNavigation();
  const form = useForm({
    mode: 'uncontrolled',
    validate: zod4Resolver(loginSchema),
    initialValues: loginSchema.parse({}),
  });

  function handleSubmit(values: z.infer<typeof loginSchema>) {
    submit(values, { method: 'post', encType: 'application/json' });
  }

  return (
    <Fragment>
      <Title mt='xl' order={1} fw={500} ta='center'>
        Welcome back
      </Title>
      <Title order={2} size='h4' mt='xs' fw={400} ta='center'>
        Sign in to your account
      </Title>

      <Form method='post' action={pathname} onSubmit={form.onSubmit(handleSubmit)}>
        <Stack mt='xl' gap='lg'>
          <TextInput
            label='Email'
            type='email'
            placeholder='you@example.com'
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label='Password'
            placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;'
            {...form.getInputProps('password')}
          />
        </Stack>

        <Button type='submit' fullWidth mt='xl' loading={formAction === pathname}>
          Login
        </Button>
      </Form>
    </Fragment>
  );
}
