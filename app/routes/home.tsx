import { Button, Center, Container } from "@mantine/core";
import { createClient } from "app/utils/supabase.server";
import { NavLink, redirect } from "react-router";

import { ROUTES } from "#/constants/routes";

import type { Route } from "./+types/root-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);

  const { data } = await supabase.auth.getUser();

  if (data.user) {
    return redirect(ROUTES.OVERVIEW);
  }
}

export default function Home() {
  return (
    <Container py="xl">
      <title>Vault</title>
      <meta
        name="description"
        content="Vault is an investment tracking tool built by piku-afk."
      />
      <Center>
        <Button component={NavLink} to={ROUTES.LOGIN}>
          Login
        </Button>
      </Center>
    </Container>
  );
}
