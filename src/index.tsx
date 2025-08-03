import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router.ts';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
