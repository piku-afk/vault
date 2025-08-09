import { Anchor, Box, Container, Text } from "@mantine/core";
import type { RefObject } from "react";

export function Footer(props: { ref: RefObject<HTMLDivElement> }) {
  return (
    <Box
      ref={props.ref}
      component="footer"
      bg="violet.0"
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      // style={(theme) => ({
      //   borderTop: `1px solid ${theme.colors.gray[3]}`,
      // })}
    >
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
