import {
  Anchor,
  Card,
  type CardProps,
  CardSection,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Fragment, type PropsWithChildren, type RefObject } from "react";
import { NavLink } from "react-router";

import { useInContainer } from "#/hooks/use-in-container";

export function Section2(
  props: PropsWithChildren<
    { title: string; subText?: string; ref?: RefObject<HTMLDivElement> } & Omit<
      CardProps,
      "component"
    >
  >,
) {
  const { title, subText, children, ...boxProps } = props;

  return (
    <Card component="section" withBorder {...boxProps}>
      {title && (
        <Fragment>
          <Group mb="md" gap="xs" style={{ alignItems: "baseline" }}>
            <Title order={2} size="h3" fw={500}>
              {title}
            </Title>
            {subText && <Text size="sm">{subText}</Text>}
          </Group>
          <CardSection>
            <Divider />
          </CardSection>
        </Fragment>
      )}

      {children}
    </Card>
  );
}
