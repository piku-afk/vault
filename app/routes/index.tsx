import { Button, Container } from "@mantine/core";
import { createClient } from "app/utils/supabase.server";
import { NavLink, redirect } from "react-router";

import { ROUTES } from "#/constants/routes";

import type { Route } from "./+types/root-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);

  const { data } = await supabase.auth.getUser();

  if (data.user) {
    console.log(data.user);
    return redirect(ROUTES.OVERVIEW);
  }
}

export default function Home() {
  return (
    <Container>
      <Button component={NavLink} to="/login">
        Login
      </Button>
    </Container>
  );
}
