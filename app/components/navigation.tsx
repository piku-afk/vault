import {
  Box,
  Container,
  Group,
  ScrollArea,
  UnstyledButton,
  Text,
} from "@mantine/core";
import { BarChart3, Plus, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export function Navigation() {
  const { pathname } = useLocation();

  const navItems: NavItem[] = [
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
    {
      label: "Add Transaction",
      path: "/investments/add",
      icon: <Plus size={16} />,
    },
  ];

  return (
    <Box
      component="nav"
      bg="white"
      style={{
        borderBottom: "1px solid #e9ecef",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Container size="xl" py="xs">
        <ScrollArea>
          <Group gap="xs" wrap="nowrap">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <UnstyledButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background: isActive ? "#f8f9fa" : "transparent",
                    border: isActive
                      ? "1px solid #e9ecef"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                    minWidth: "fit-content",
                  }}
                >
                  <Group gap="xs" justify="center">
                    <Box c={isActive ? "violet.7" : "dark.6"}>{item.icon}</Box>
                    <Text
                      fw={isActive ? 600 : 500}
                      size="sm"
                      c={isActive ? "violet.7" : "dark.6"}
                    >
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              );
            })}
          </Group>
        </ScrollArea>
      </Container>
    </Box>
  );
}
