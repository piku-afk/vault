import { Anchor, Box, Title } from "@mantine/core";
import type { PropsWithChildren, RefObject } from "react";

import { useInContainer } from "#/hooks/use-in-container";

export function Section(
  props: PropsWithChildren<{ title: string; ref: RefObject<HTMLDivElement> }>,
) {
  const sectionId = props.title.toLowerCase().replace(/\s+/g, "-");
  const { isInContainer: isInDialog, ref } = useInContainer("dialog");

  return (
    <Box ref={props.ref} component="section">
      {props.title && (
        <Anchor c="black" underline="never" href={`#${sectionId}`}>
          <Title
            ref={ref as RefObject<HTMLHeadingElement>}
            id={sectionId}
            order={isInDialog ? 3 : 2}
            size={isInDialog ? "h4" : "h3"}
            mb={props.children ? (isInDialog ? "sm" : "md") : 0}
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
