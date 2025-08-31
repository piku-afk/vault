import { AppShell, Box } from "@mantine/core";
import { Outlet } from "react-router";

import { Footer } from "./footer";

export function Main() {
  return (
    <AppShell.Main>
      <Box pb={49}>
        <Box
          bg="white"
          pos="relative"
          style={(theme) => ({
            zIndex: 1,
            boxShadow: theme.shadows.md,
          })}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </AppShell.Main>
  );
}
