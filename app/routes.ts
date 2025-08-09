import { index, layout, type RouteConfig, route } from '@react-router/dev/routes';

import { ROUTES } from './constants/routes';

export default [
  layout('routes/root-layout.tsx', [
    index('routes/index.tsx'),
    route(ROUTES.LOGOUT, 'routes/logout.tsx'),
    layout('routes/auth/auth-layout.tsx', [route(ROUTES.LOGIN, 'routes/auth/login.tsx')]),
    layout('routes/private/private-layout.tsx', [
      route(ROUTES.OVERVIEW, 'routes/private/overview.tsx'),
      route(ROUTES.INVESTMENTS, 'routes/private/investments.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
