import { Container } from "@mantine/core";
import { Outlet } from "react-router";

// import { Navigation } from "#/components/navigation";

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
