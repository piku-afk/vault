import { AppShell, Box } from "@mantine/core";
import { Outlet } from "react-router";

import { Footer } from "./footer";

export function Main() {
  return (
    <AppShell.Main display="flex">
      <Box pb={49} style={{ flexGrow: 1, flexDirection: "column" }}>
        <Box
          bg="white"
          pos="relative"
          h="100%"
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
