import { Anchor, Box, Container, Stack, Text } from "@mantine/core";
import { Outlet } from "react-router";

import { Header } from "#/components/header";

export default function RootLayout() {
  return (
    <Stack h="100%">
      <Header />

      <Box component="main" bg="white" style={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        bg="violet.0"
        style={(theme) => ({ borderTop: `1px solid ${theme.colors.gray[3]}` })}
      >
        <Container py="xs">
          <Text size="xs" ta="center" c="dimmed">
            Vault is an investment tracking tool developed by{" "}
            <Anchor
              href="https://github.com/piku-afk"
              target="_blank"
              rel="noopener noreferrer"
            >
              piku-afk
            </Anchor>
            .
          </Text>
        </Container>
      </Box>
    </Stack>
  );
}
