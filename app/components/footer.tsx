import { Anchor, Box, Container, Text } from "@mantine/core";
import type { Ref } from "react";

export function Footer(props: { ref: Ref<HTMLDivElement> }) {
  return (
    <Box ref={props.ref} bg="violet.0">
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
