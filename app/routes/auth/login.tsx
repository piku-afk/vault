import {
  Alert,
  Button,
  Fieldset,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { createClient } from "app/utils/supabase.server";
import { TriangleAlert } from "lucide-react";
import { Fragment } from "react";
import { Form, redirect, useActionData } from "react-router";
import { z } from "zod/v4";

import { ROUTES } from "#/constants/routes";

import type { Route } from "./+types/login";

const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" }),
});

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createClient(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries()) as z.infer<
    typeof loginSchema
  >;
  const parsedData = loginSchema.safeParse(data);

  if (!parsedData.success) {
    return z.flattenError(parsedData.error);
  }

  const { error } = await supabase.auth.signInWithPassword(parsedData.data);

  if (error) {
    return {
      formErrors: [error.message],
      fieldErrors: { email: [], password: [] },
    };
  }

  throw redirect(ROUTES.HOME, { headers });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const formError = actionData?.formErrors?.[0];
  const emailError = actionData?.fieldErrors?.email?.[0];
  const passwordError = actionData?.fieldErrors?.password?.[0];

  return (
    <Fragment>
      <Title mt="xl" order={1} fw={500} ta="center">
        Welcome back
      </Title>
      <Title order={2} size="h4" mt="xs" fw={400} ta="center">
        Sign in to your account
      </Title>

      <Form method="post" action={ROUTES.LOGIN}>
        <Fieldset variant="unstyled">
          <Stack mt="xl" gap="lg">
            <TextInput
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              placeholder="you@example.com"
              error={emailError}
            />

            <PasswordInput
              name="password"
              label="Password"
              autoComplete="current-password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              error={passwordError}
            />

            {formError && (
              <Alert
                color="red"
                variant="light"
                title="Error"
                icon={<TriangleAlert />}
              >
                {formError}
              </Alert>
            )}
          </Stack>

          <Button type="submit" fullWidth mt="xl">
            Login
          </Button>
        </Fieldset>
      </Form>
    </Fragment>
  );
}
