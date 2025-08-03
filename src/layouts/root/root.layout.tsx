import { Box } from '@mantine/core';
import { Outlet } from 'react-router';

Component.displayName = 'RootLayout';

export function Component() {
  return (
    <Box mih='100vh' bg='violet.0'>
      <Outlet />
    </Box>
  );
}
