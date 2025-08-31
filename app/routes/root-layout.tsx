import { AppShell } from "@mantine/core";
import { useEffect } from "react";
import { useLocation } from "react-router";

import { Footer } from "#/components/footer";
import { Header } from "#/components/header";
import { Main } from "#/components/main";

export const HEADER_HEIGHT = 56;
export const FOOTER_HEIGHT = 49;

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
      <Header />
      <Main />
      <Footer />
    </AppShell>
  );
}
