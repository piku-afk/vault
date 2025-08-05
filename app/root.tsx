import { Box, Container, Group, Image, MantineProvider, Stack, Title } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';

import '@fontsource-variable/inter';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { theme } from '#/theme.ts';

export const links: Route.LinksFunction = () => [{ rel: 'icon', href: '/vault.svg' }];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' style={{ height: '100%' }}>
      <head>
        <meta charSet='utf-8' />
        <title>Vault</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body style={{ height: '100%' }}>
        <MantineProvider theme={theme}>
          <Stack component='main' h='100%' bg='violet.0' gap='xl'>
            <Box component='header'>
              <Container py='lg'>
                <Group gap='xs'>
                  <Image src='/vault.svg' alt='Vault Icon' w='auto' h={32} />
                  <Title order={1} size='h5' fw='normal'>
                    Vault by pikuh
                  </Title>
                </Group>
              </Container>
            </Box>
            {children}
            <Notifications />
            <ScrollRestoration />
            <Scripts />
          </Stack>
        </MantineProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
