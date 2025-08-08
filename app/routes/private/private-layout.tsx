import { Container, Tabs } from "@mantine/core";
import { Outlet, redirect, useLocation, useNavigate } from "react-router";

import { createClient } from "#/utils/supabase.server";

import type { Route } from "./+types/private-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);

  const { error } = await supabase.auth.getUser();

  if (error) {
    throw redirect("/");
  }
}

export default function PrivateLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Container w="100%" size="md">
      <Tabs
        mb="xl"
        variant="default"
        value={pathname}
        onChange={(value) => {
          if (value) {
            navigate(value);
          }
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="/overview">Overview</Tabs.Tab>
          <Tabs.Tab value="/investments">Investments</Tabs.Tab>
          <Tabs.Tab disabled value="/home-transactions">
            Home Transactions
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Outlet />
    </Container>
  );
}
