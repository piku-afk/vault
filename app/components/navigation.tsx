import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  ScrollArea,
} from "@mantine/core";
import { BarChart3, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router";

const navItems = [
  {
    label: "Overview",
    path: "/overview",
    icon: <BarChart3 size={16} />,
  },
  {
    label: "Investments",
    path: "/investments",
    icon: <TrendingUp size={16} />,
  },
];

export function Navigation() {
  const { pathname } = useLocation();

  return (
    <Box component="nav" bg="white" pos="sticky" top={0} style={{ zIndex: 1 }}>
      <Container py="md">
        <ScrollArea>
          <Group gap="md" wrap="nowrap">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  size="sm"
                  miw="fit-content"
                  variant={isActive ? "light" : "default"}
                  style={{ whiteSpace: "nowrap" }}
                  leftSection={item.icon}
                >
                  {item.label}
                </Button>
              );
            })}
          </Group>
        </ScrollArea>
      </Container>
      <Divider />
    </Box>
  );
}
