import {
  Button,
  Center,
  Container,
  PasswordInput,
  Stack,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { UserLock } from 'lucide-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { motion } from 'motion/react';
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
        <Center>
          <ThemeIcon variant='light' size='xl'>
            <UserLock />
          </ThemeIcon>
        </Center>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}>
          <Title mt='xl' order={1} fw={500} ta='center'>
            Welcome back
          </Title>
          <Title order={2} size='h4' mt='xs' fw={400} ta='center'>
            Sign in to your account
          </Title>
        </motion.div>

        <motion.form
          onSubmit={form.onSubmit(handleSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}>
          <Stack mt='xl' gap='lg'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}>
              <TextInput
                label='Email'
                type='email'
                placeholder='you@example.com'
                {...form.getInputProps('email')}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}>
              <PasswordInput
                label='Password'
                placeholder='&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;'
                {...form.getInputProps('password')}
              />
            </motion.div>
          </Stack>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}>
            <Button type='submit' fullWidth mt='xl'>
              Sign In
            </Button>
          </motion.div>
        </motion.form>
      </Container>
    </Center>
  );
}
