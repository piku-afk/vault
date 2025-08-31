import { AppShell, Box } from "@mantine/core";
import { Outlet } from "react-router";

export function Main() {
  return (
    <AppShell.Main>
      <Box
        bg="white"
        pos="relative"
        style={(theme) => ({ zIndex: 1, boxShadow: theme.shadows.md })}
      >
        <Outlet />
      </Box>
    </AppShell.Main>
  );
}
