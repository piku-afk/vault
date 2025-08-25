import {
  ActionIcon,
  Anchor,
  Box,
  Container,
  Group,
  Image,
  Menu,
  Stack,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { LogOut, User } from "lucide-react";
import type { Ref } from "react";
import { Link, matchPath, useLocation } from "react-router";

import { AUTH_ROUTES, PUBLIC_ROUTES } from "#/constants/routes";

dayjs.extend(advancedFormat);

function getPageType(pathname: string) {
  const isAuthPage = AUTH_ROUTES.some(
    (route) => !!matchPath(route, pathname)?.pathname,
  );
  const isPublicPage = PUBLIC_ROUTES.some(
    (route) => !!matchPath(route, pathname)?.pathname,
  );

  return { isAuthPage, isPublicPage, isPrivatePage: !isPublicPage };
}

export function Header(props: { ref: Ref<HTMLDivElement> }) {
  const { pathname } = useLocation();
  const pageType = getPageType(pathname);

  return (
    <Box ref={props.ref} bg="white">
      <Container fluid py="sm" px={{ base: "md", xs: "xl" }}>
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Anchor
              underline="never"
              component={Link}
              to={pageType.isPublicPage ? "/" : "/overview"}
              c="dark"
            >
              <Group gap="xs">
                <Image src="/vault.svg" alt="Vault Icon" w="auto" h={32} />
                <div>
                  <Title order={2} size="h4" fw={500}>
                    Vault
                  </Title>
                </div>
              </Group>
            </Anchor>

            {pageType.isPrivatePage && (
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="light">
                    <User size={18} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown miw={180}>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Divider />
                  <Menu.Item
                    component={Link}
                    to="/logout"
                    leftSection={<LogOut size={16} />}
                    color="red"
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
