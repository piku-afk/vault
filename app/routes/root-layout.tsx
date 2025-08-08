import { Stack } from "@mantine/core";
import { Outlet } from "react-router";

import { Header } from "#/components/header";

export default function RootLayout() {
  return (
    <Stack component="main" gap="xl">
      <Header />
      <Outlet />
    </Stack>
  );
}
