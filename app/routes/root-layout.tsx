import { Stack } from "@mantine/core";
import { useRef } from "react";

import { Footer } from "#/components/footer";
import { Header } from "#/components/header";
import { Main } from "#/components/main";

export default function RootLayout() {
  // biome-ignore lint/style/noNonNullAssertion: need this for ts error
  const headerRef = useRef<HTMLDivElement>(null!);
  // biome-ignore lint/style/noNonNullAssertion: need this for ts error
  const footerRef = useRef<HTMLDivElement>(null!);

  return (
    <Stack mih="100vh">
      <Header ref={headerRef} />
      <Main headerRef={headerRef} footerRef={footerRef} />
      <Footer ref={footerRef} />
    </Stack>
  );
}
