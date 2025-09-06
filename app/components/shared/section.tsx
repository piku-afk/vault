import { Anchor, Box, type BoxProps, Title } from "@mantine/core";
import type { PropsWithChildren, RefObject } from "react";
import { NavLink } from "react-router";

import { useInContainer } from "#/hooks/use-in-container";

export function Section(
  props: PropsWithChildren<
    { title: string; ref?: RefObject<HTMLDivElement> } & Omit<
      BoxProps,
      "component"
    >
  >,
) {
  const { title, children, ...boxProps } = props;
  const sectionId = title?.toLowerCase().replace(/\s+/g, "-");
  const { isInContainer: isInDialog, ref } = useInContainer("dialog");

  return (
    <Box component="section" {...boxProps}>
      {title && (
        <Anchor
          component={NavLink}
          to={`#${sectionId}`}
          c="black"
          underline="never"
        >
          <Title
            ref={ref as RefObject<HTMLHeadingElement>}
            id={sectionId}
            order={isInDialog ? 3 : 2}
            size={isInDialog ? "h4" : "h3"}
            mb={children ? (isInDialog ? "sm" : "md") : 0}
            fw={500}
          >
            {title}
          </Title>
        </Anchor>
      )}

      {children}
    </Box>
  );
}
