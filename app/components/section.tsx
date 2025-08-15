import { Anchor, Box, Title } from "@mantine/core";
import { type PropsWithChildren, useEffect } from "react";

export function Section(props: PropsWithChildren & { title: string }) {
  const sectionId = props.title.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    // Check if the current URL hash matches this section's ID
    if (window.location.hash === `#${sectionId}`) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [sectionId]);

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
