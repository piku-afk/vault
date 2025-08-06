import { createBrowserRouter } from 'react-router';
import { ROUTES } from './constants/routes.ts';

export const router = createBrowserRouter([
  {
    HydrateFallback: () => null,
    lazy: () => import('./layouts/root/root.layout.tsx'),
    children: [
      {
        lazy: () => import('./layouts/auth/auth.layout.tsx'),
        children: [
          { path: ROUTES.TWO_FACTOR, lazy: () => import('./pages/two-factor/two-factor.page.tsx') },
        ],
      },
      { path: ROUTES.INVESTMENTS, lazy: () => import('./pages/investments/investments.page.tsx') },
    ],
  },
]);
