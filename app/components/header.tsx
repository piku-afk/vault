import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Container,
  Group,
  Image,
  Menu,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { LogOut, Plus, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Header() {
  const { pathname } = useLocation();
  const isPublicPage = ["/", "/login"].includes(pathname);

  return (
    <Box
      component="header"
      bg="white"
      style={{ borderBottom: "1px solid #e9ecef" }}
    >
      <Container size="xl" py="md">
        <Group justify="space-between" align="center">
          {/* Logo Section */}
          <Anchor
            underline="never"
            component={Link}
            to={isPublicPage ? "/" : "/overview"}
            c="dark"
          >
            <Group gap="sm">
              <Box
                style={{
                  padding: "8px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #7950f2 0%, #9775fa 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image src="/vault.svg" alt="Vault Icon" w={20} h={20} />
              </Box>
              <div>
                <Title order={2} size="h4" fw={700} c="dark.8">
                  Vault
                </Title>
                <Text size="xs" c="dimmed" mt={-2}>
                  Investment Tracker
                </Text>
              </div>
            </Group>
          </Anchor>

          {/* Actions */}
          {!isPublicPage && (
            <Group gap="xs">
              {/* Add Transaction Button */}
              <Button
                component={Link}
                to="/investments/add"
                leftSection={<Plus size={16} />}
                variant="gradient"
                gradient={{ from: "violet", to: "purple" }}
                size="sm"
                radius="md"
                visibleFrom="sm"
              >
                Add Transaction
              </Button>

              {/* Mobile Add Button */}
              <ActionIcon
                component={Link}
                to="/investments/add"
                variant="gradient"
                gradient={{ from: "violet", to: "purple" }}
                size="lg"
                radius="md"
                hiddenFrom="sm"
              >
                <Plus size={18} />
              </ActionIcon>

              {/* User Menu */}
              <Menu shadow="lg" position="bottom-end" radius="md">
                <Menu.Target>
                  <UnstyledButton>
                    <Avatar
                      size="sm"
                      radius="xl"
                      variant="light"
                      color="violet"
                    >
                      <User size={16} />
                    </Avatar>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
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
            </Group>
          )}
        </Group>
      </Container>
    </Box>
  );
}
