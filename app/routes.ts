import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

import { ROUTES } from "./constants/routes";

export default [
  layout("routes/root-layout.tsx", [
    // public routes
    index("routes/home.tsx"),
    // public - auth routes
    layout("routes/auth/auth-layout.tsx", [
      route(ROUTES.LOGIN, "routes/auth/login.tsx"),
      route(ROUTES.LOGOUT, "routes/logout.tsx"),
    ]),
    // private routes
    layout("routes/private/private-layout.tsx", [
      route(ROUTES.OVERVIEW, "routes/private/overview.tsx"),
      route(ROUTES.INVESTMENTS, "routes/private/investments.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
