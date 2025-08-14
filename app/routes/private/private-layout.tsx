import { Container } from "@mantine/core";
import { Outlet } from "react-router";

// import { Navigation } from "#/components/navigation";
import { requireAuth } from "#/middlewares/requireAuth";

import type { Route } from "./+types/private-layout";

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [
  requireAuth,
];

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
