import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import '@fontsource-variable/inter';
import '@mantine/core/styles.css';

import { router } from './router.ts';
import { theme } from './theme.ts';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
);
