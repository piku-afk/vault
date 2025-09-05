import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

import { ROUTES } from "./constants/routes";

export default [
  layout("routes/root-layout.tsx", [
    index("routes/home.tsx"),
    route(ROUTES.LOGOUT, "routes/logout.tsx"),
    layout("routes/auth/auth-layout.tsx", [
      route(ROUTES.LOGIN, "routes/auth/login.tsx"),
    ]),
    layout("routes/private/private-layout.tsx", [
      route(ROUTES.EMERGENCY_PLAN, "routes/private/emergency-plan.tsx"),
      route(ROUTES.OVERVIEW, "routes/private/overview.tsx", [
        route(ROUTES.SIP_BREAKDOWN, "routes/private/sip-breakdown.tsx", {
          id: "overview-sip-breakdown",
        }),
        route(ROUTES.CATEGORY_DETAILS, "routes/private/category-details.tsx", [
          route(ROUTES.SIP_BREAKDOWN, "routes/private/sip-breakdown.tsx", {
            id: "category-sip-breakdown",
          }),
        ]),
      ]),
      route(ROUTES.INVESTMENTS, "routes/private/investments.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
