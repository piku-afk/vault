import { AppShell, Box } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router";

import { Footer } from "#/components/footer";
import { Header } from "#/components/header";
import { db } from "#/database/kysely.server";

export function loader() {
  return db
    .selectFrom("mutual_fund_schemes")
    .select((eb) => eb.fn.max("nav_date").as("nav_date"))
    .executeTakeFirstOrThrow();
}

export function useRootLayoutLoaderData() {
  return useLoaderData<typeof loader>();
}

export default function RootLayout() {
  const { hash } = useLocation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const calculateHeaderHeight = useCallback((header: HTMLDivElement | null) => {
    const height = (header?.clientHeight ?? 0) + 1;
    setHeaderHeight(height);
  }, []);

  const calculateFooterHeight = useCallback((footer: HTMLDivElement | null) => {
    const height = (footer?.clientHeight ?? 0) + 1;
    setFooterHeight(height);
  }, []);

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
      header={{ height: headerHeight }}
      footer={{ height: footerHeight }}
    >
      <AppShell.Header>
        <Header ref={calculateHeaderHeight} />
      </AppShell.Header>
      <AppShell.Main>
        <Box bg="white">
          <Outlet />
        </Box>
      </AppShell.Main>
      <AppShell.Footer style={{ zIndex: -1 }}>
        <Footer ref={calculateFooterHeight} />
      </AppShell.Footer>
    </AppShell>
  );
}
