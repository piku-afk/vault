import { Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import { useLoaderData } from "react-router";

import { Footer } from "#/components/footer";
import { Header } from "#/components/header";
import { Main } from "#/components/main";
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
  // biome-ignore lint/style/noNonNullAssertion: need this for ts error
  const headerRef = useRef<HTMLDivElement>(null!);
  // biome-ignore lint/style/noNonNullAssertion: need this for ts error
  const footerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <Stack gap={0} mih="100vh">
      <Header ref={headerRef} />
      <Main headerRef={headerRef} footerRef={footerRef} />
      <Footer ref={footerRef} />
    </Stack>
  );
}
