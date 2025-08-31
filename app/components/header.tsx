import {
  ActionIcon,
  Anchor,
  AppShell,
  Drawer,
  Group,
  Image,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Menu } from "lucide-react";
import { Link } from "react-router";

import { ROUTES } from "#/constants/routes";

import { NAVIGATION_CONTAINER_WIDTH, Navigation } from "./navigation";

dayjs.extend(advancedFormat);

export function Header(props: { isPrivatePage?: boolean }) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell.Header bg="violet.0" py="sm" px={{ base: "md", xs: "xl" }}>
      <Group gap="md">
        {props.isPrivatePage && (
          <ActionIcon
            size="md"
            hiddenFrom="xs"
            variant="outline"
            onClick={toggle}
          >
            <Menu size={18} />
          </ActionIcon>
        )}
        <Anchor underline="never" component={Link} to={ROUTES.HOME} c="dark">
          <Group gap="xs">
            <Image src="/vault.svg" alt="Vault Icon" w="auto" h={32} />
            <Title order={2} size="h4" fw={500}>
              Vault
            </Title>
          </Group>
        </Anchor>
      </Group>
      <Drawer
        hiddenFrom="xs"
        opened={opened}
        onClose={toggle}
        withCloseButton={false}
        size={NAVIGATION_CONTAINER_WIDTH}
        styles={{ body: { padding: 0, height: "100%" } }}
      >
        <Navigation />
      </Drawer>
    </AppShell.Header>
  );
}
