import { Center, Container, ThemeIcon } from '@mantine/core';
import { KeySquare, UserLock } from 'lucide-react';
import type { JSX } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ROUTES } from '../../constants/routes.ts';

Component.displayName = 'AuthLayout';

export function Component() {
  const { pathname } = useLocation();

  return (
    <Center mih='100vh'>
      <Container fluid w='100%' maw={480} pb='xl'>
        <Center>
          <ThemeIcon variant='light' size='xl'>
            {getIconForRoute(pathname)}
          </ThemeIcon>
        </Center>
        <Outlet />
      </Container>
    </Center>
  );
}

function getIconForRoute(route: string): JSX.Element | null {
  switch (route) {
    case ROUTES.SIGN_IN:
      return <UserLock />;
    case ROUTES.TWO_FACTOR:
      return <KeySquare />;
    default:
      return null;
  }
}
