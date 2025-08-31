import { Box, Button, type ButtonProps, Stack } from "@mantine/core";
import { BarChart3, LogOut } from "lucide-react";
import { Link, type LinkProps, useLocation } from "react-router";

import { ROUTES } from "#/constants/routes";

export const NAVIGATION_CONTAINER_WIDTH = 320;

type NavItem = Omit<ButtonProps, "children" | "component"> &
  LinkProps & { label: string };

const navItems: NavItem[] = [
  {
    label: "Overview",
    to: ROUTES.OVERVIEW,
    leftSection: <BarChart3 size={16} />,
  },
  {
    label: "Logout",
    to: "/investments",
    leftSection: <LogOut size={16} />,
    style: { marginTop: "auto" },
    color: "red",
  },
];

export function Navigation() {
  const { pathname } = useLocation();

  return (
    <Box component="nav" bg="white" h="100%" p="md">
      <Stack gap="xs" h="100%">
        {navItems.map((item) => {
          const { label, ...restItem } = item;
          const isActive = pathname === item.to;

          return (
            <Button
              key={label}
              component={Link}
              size="sm"
              miw="fit-content"
              justify="flex-start"
              variant={isActive ? "light" : "subtle"}
              style={{ whiteSpace: "nowrap" }}
              {...restItem}
            >
              {label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
