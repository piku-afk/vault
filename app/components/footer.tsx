import { Anchor, AppShell, Container, Text } from "@mantine/core";

export function Footer() {
  return (
    <AppShell.Footer bg="violet.0" style={{ zIndex: "auto" }}>
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
