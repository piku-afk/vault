import { Center, Container, ThemeIcon } from '@mantine/core';
import { KeySquare, UserLock } from 'lucide-react';
import type { JSX } from 'react';
import { Outlet, useLocation } from 'react-router';

import { ROUTES } from '#/constants/routes.ts';

export default function AuthLayout() {
  const { pathname } = useLocation();

  return (
    <Container w='100%' size='xs' p={{ xs: 'xl', base: 'md' }}>
      <Center>
        <ThemeIcon variant='light' size='xl'>
          {getIconForRoute(pathname)}
        </ThemeIcon>
      </Center>
      <Outlet />
    </Container>
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
