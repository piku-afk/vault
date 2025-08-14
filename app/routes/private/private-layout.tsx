import { Container } from "@mantine/core";
import { Outlet, redirect } from "react-router";

// import { Navigation } from "#/components/navigation";
import { createClient } from "#/utils/supabase.server";

import type { Route } from "./+types/private-layout";

export async function loader({ request }: Route.LoaderArgs) {
  console.log("private");
  const { supabase } = createClient(request);

  const { error } = await supabase.auth.getUser();

  if (error) {
    throw redirect("/");
  }
}

export default function PrivateLayout() {
  return (
    <>
      {/* <Navigation /> */}
      <Container w="100%" size="md" pb="xl" pt="md">
        <Outlet />
      </Container>
    </>
  );
}
