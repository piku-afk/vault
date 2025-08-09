import { Center, Container, ThemeIcon } from "@mantine/core";
import { UserLock } from "lucide-react";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <Container size="xs" p="xl">
      <Center>
        <ThemeIcon variant="light" size="xl">
          <UserLock />
        </ThemeIcon>
      </Center>
      <Outlet />
    </Container>
  );
}
