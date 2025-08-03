import { Button, Center, Container, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { type ActionFunctionArgs, redirect, useSubmit } from 'react-router';
import { z } from 'zod/v4';

import { ROUTES } from '../../constants/routes.ts';
import { showErrorNotification } from '../../utils/notification.ts';
import { supabaseClient } from '../../utils/supabaseClient.ts';
import { setAccessToken } from '../../utils/token.ts';

Component.displayName = 'Home';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.json();
  const { data, error } = await supabaseClient.auth.signInWithPassword(formData);

  if (error) {
    showErrorNotification(error.message);
  }

  if (data.session) {
    const { access_token, expires_at } = data.session;
    setAccessToken(access_token, expires_at ? new Date(expires_at) : undefined);
    return redirect(ROUTES.INVESTMENTS);
  }

  return null;
}

const loginSchema = z.object({
  email: z.email().default(''),
  password: z.string().min(8, { error: 'Password must be at least 8 characters long' }).default(''),
});

export function Component() {
  const submit = useSubmit();
  const form = useForm({
    mode: 'uncontrolled',
    validate: zod4Resolver(loginSchema),
    initialValues: loginSchema.parse({}),
  });

  function handleSubmit(values: z.infer<typeof loginSchema>) {
    submit(values, { method: 'post', encType: 'application/json' });
  }

  return (
    <Center mih='100vh'>
      <Container fluid w='100%' maw={440}>
        <Title order={1} fw={500}>
          Welcome back
        </Title>
        <Title order={2} size='h4' mt='xs' fw={400}>
          Sign in to your account
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
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

          <Button type='submit' fullWidth mt='xl'>
            Sign In
          </Button>
        </form>
      </Container>
    </Center>
  );
}
