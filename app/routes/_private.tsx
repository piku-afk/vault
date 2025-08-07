import { Container } from "@mantine/core";
import { Outlet, redirect } from "react-router";
import { createClient } from "#/utils/supabase.server";
import type { Route } from "./+types/_private";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);

  const { error } = await supabase.auth.getUser();

  if (error) {
    throw redirect("/");
  }
}

export default function PrivateLayout() {
  return (
    <Container w="100%" size="md">
      <Outlet />
    </Container>
  );
}
