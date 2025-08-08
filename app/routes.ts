import { layout, type RouteConfig, route } from '@react-router/dev/routes';

import { ROUTES } from '#/constants/routes';

export default [
  layout('routes/root-layout.tsx', [
    layout('routes/auth/layout.tsx', [route(ROUTES.LOGIN, 'routes/auth/login.tsx')]),
  ]),
] satisfies RouteConfig;
