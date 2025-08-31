import { Anchor, AppShell, Container, Text } from "@mantine/core";

import { NAVIGATION_CONTAINER_WIDTH } from "./navigation";

export function Footer() {
  return (
    <AppShell.Footer
      w={{ base: "100%", xs: `calc(100% - ${NAVIGATION_CONTAINER_WIDTH}px)` }}
      bg="violet.0"
      left="auto"
      style={{ zIndex: "auto" }}
    >
      <Container py="md">
        <Text size="xs" ta="center" c="dimmed">
          Vault is an investment tracking tool built by&nbsp;
          <Anchor
            href="https://github.com/piku-afk"
            target="_blank"
            rel="noopener noreferrer"
          >
            piku-afk
          </Anchor>
        </Text>
      </Container>
    </AppShell.Footer>
  );
}
