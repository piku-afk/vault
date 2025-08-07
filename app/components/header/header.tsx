import {
  ActionIcon,
  Anchor,
  Box,
  Container,
  Divider,
  Group,
  Image,
  Menu,
  Title,
} from "@mantine/core";
import { LogOut, Menu as MenuIcon, Plus } from "lucide-react";

import { Link, useLocation } from "react-router";

export function Header() {
  const { pathname } = useLocation();
  const isInvestmentPage = pathname.includes("/investments");

  return (
    <Box component="header">
      <Container py="lg">
        <Group>
          <Anchor underline="never" component={Link} to="/" c="black" mr="auto">
            <Group gap="xs">
              <Image src="/vault.svg" alt="Vault Icon" w="auto" h={32} />
              <Title order={1} size="h5" fw="normal">
                Vault by pikuh
              </Title>
            </Group>
          </Anchor>

          {isInvestmentPage && (
            <Menu shadow="md" position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="light">
                  <MenuIcon size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Actions</Menu.Label>
                <Menu.Item
                  component={Link}
                  to="/investments/add"
                  leftSection={<Plus size={16} />}
                >
                  Add Transactions
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  component={Link}
                  to="/logout"
                  leftSection={<LogOut size={16} />}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>

      <Divider />
    </Box>
  );
}
