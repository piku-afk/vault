import { Anchor, Box, Container, Text } from "@mantine/core";

export function Footer() {
  return (
    <Box bg="violet.0">
      <Container py="xs">
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
    </Box>
  );
}
