import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Container,
  Group,
  Image,
  Menu,
  Skeleton,
  Stack,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { LogOut, User } from "lucide-react";
import { type RefObject, Suspense } from "react";
import { Await, Link, matchPath, useLocation } from "react-router";

import { ROUTES } from "#/constants/routes";
import { useRootLayoutLoaderData } from "#/routes/root-layout";

dayjs.extend(advancedFormat);

function getPageType(pathname: string) {
  const authRoutes = [ROUTES.LOGIN, ROUTES.LOGOUT];
  const publicRoutes = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.LOGOUT];

  const isAuthPage = authRoutes.some(
    (route) => !!matchPath(route, pathname)?.pathname,
  );
  const isPublicPage = publicRoutes.some(
    (route) => !!matchPath(route, pathname)?.pathname,
  );

  return { isAuthPage, isPublicPage, isPrivatePage: !isPublicPage };
}

export function Header(props: { ref: RefObject<HTMLDivElement> }) {
  const { pathname } = useLocation();
  const pageType = getPageType(pathname);
  const loaderData = useRootLayoutLoaderData();

  return (
    <Box
      ref={props.ref}
      component="header"
      bg="white"
      style={(theme) => ({ borderBottom: `1px solid ${theme.colors.gray[3]}` })}
    >
      <Container size="md" py="sm">
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

            <Badge size="xs" variant="transparent" ml="auto">
              <Suspense fallback={<Skeleton width={80} h={12} />}>
                <Await resolve={loaderData.nav_date}>
                  Data as of:&nbsp;
                  {dayjs(loaderData.nav_date).format("Do MMMM YYYY")}
                </Await>
              </Suspense>
            </Badge>

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
