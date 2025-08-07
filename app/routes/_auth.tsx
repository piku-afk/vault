import { Center, Container, ThemeIcon } from "@mantine/core";
import { UserLock } from "lucide-react";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <Container w="100%" size="xs" p={{ xs: "xl", base: "md" }}>
      <Center>
        <ThemeIcon variant="light" size="xl">
          <UserLock />
        </ThemeIcon>
      </Center>
      <Outlet />
    </Container>
  );
}
