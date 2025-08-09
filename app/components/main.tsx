import { Box } from "@mantine/core";
import type { RefObject } from "react";
import { Outlet } from "react-router";

export function Main(props: {
  headerRef: RefObject<HTMLDivElement>;
  footerRef: RefObject<HTMLDivElement>;
}) {
  return (
    <Box
      component="main"
      style={{ flexGrow: 1 }}
      pb={props.footerRef?.current?.offsetHeight}
    >
      <Box
        mih={`calc(100vh - ${props.headerRef.current?.offsetHeight}px)`}
        bg="white"
        pos="relative"
        style={(theme) => ({
          borderBottom: `1px solid ${theme.colors.gray[3]}`,
          zIndex: 1,
        })}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
