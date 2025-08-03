import { createBrowserRouter } from 'react-router';
import { ROUTES } from './constants/routes.ts';

export const router = createBrowserRouter([
  { path: ROUTES.HOME, lazy: () => import('./pages/home/home.page.tsx') },
  { path: ROUTES.INVESTMENTS, lazy: () => import('./pages/investments/investments.page.tsx') },
]);
