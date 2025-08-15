import { Anchor, Box, Title } from "@mantine/core";
import type { PropsWithChildren } from "react";

export function Section(props: PropsWithChildren & { title: string }) {
  const sectionId = props.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Box component="section">
      {props.title && (
        <Anchor c="black" underline="never" href={`#${sectionId}`}>
          <Title
            id={sectionId}
            order={2}
            size="h3"
            mb={props.children ? "md" : 0}
            fw={500}
          >
            {props.title}
          </Title>
        </Anchor>
      )}

      {props.children}
    </Box>
  );
}
