import { Stack } from "@mantine/core";

import { Header } from "#/components/header";

export default function RootLayout() {
  return (
    <Stack component="main" h="100%" gap="xl">
      <Header />
    </Stack>
  );
}
