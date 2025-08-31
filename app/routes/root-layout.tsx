import { AppShell } from "@mantine/core";
import { useEffect } from "react";
import { matchPath, useLocation } from "react-router";

import { Header } from "#/components/header";
import { Main } from "#/components/main";
import {
  NAVIGATION_CONTAINER_WIDTH,
  Navigation,
} from "#/components/navigation";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "#/constants/routes";

export const HEADER_HEIGHT = 56;
export const FOOTER_HEIGHT = 49;

function getPageType(pathname: string) {
  const isAuthPage = AUTH_ROUTES.some(
    (route) => !!matchPath(route, pathname)?.pathname,
  );
  const isPublicPage = PUBLIC_ROUTES.some(
    (route) => !!matchPath(route, pathname)?.pathname,
  );

  return { isAuthPage, isPublicPage, isPrivatePage: !isPublicPage };
}

export default function RootLayout() {
  const { hash, pathname } = useLocation();
  const pageType = getPageType(pathname);

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
      navbar={{
        width: NAVIGATION_CONTAINER_WIDTH,
        breakpoint: "sm",
        collapsed: { desktop: pageType.isPublicPage, mobile: true },
      }}
    >
      <Header />
      <AppShell.Navbar>
        <Navigation />
      </AppShell.Navbar>

      <Main />
    </AppShell>
  );
}
