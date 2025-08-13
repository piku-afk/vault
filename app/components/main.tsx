import { Box } from "@mantine/core";
import type { RefObject } from "react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

export function Main(props: {
  headerRef: RefObject<HTMLDivElement>;
  footerRef: RefObject<HTMLDivElement>;
}) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (props.footerRef.current) {
      setFooterHeight(props.footerRef.current.offsetHeight);
    }
  }, [props.footerRef]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (props.headerRef.current) {
        setHeaderHeight(props.headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (props.headerRef.current) {
      resizeObserver.observe(props.headerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [props.headerRef]);

  return (
    <Box component="main" style={{ flexGrow: 1 }} pb={footerHeight}>
      <Box
        mih={`calc(100vh - ${headerHeight}px)`}
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
