import { AppShell, Box } from "@mantine/core";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { Footer } from "#/components/footer";
import { Header } from "#/components/header";

export const HEADER_HEIGHT = 57;
export const FOOTER_HEIGHT = 38;

export default function RootLayout() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return (
    <AppShell
      header={{ height: HEADER_HEIGHT }}
      footer={{ height: FOOTER_HEIGHT }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Box bg="white">
          <Outlet />
        </Box>
      </AppShell.Main>
      <AppShell.Footer style={{ zIndex: -1 }}>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
