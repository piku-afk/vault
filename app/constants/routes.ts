export enum ROUTES {
  HOME = "/",
  LOGIN = "/login",
  LOGOUT = "/logout",
  OVERVIEW = "/overview",
  SIP_BREAKDOWN = "sip-breakdown",
  CATEGORY_DETAILS = "/overview/category/:category",
  EMERGENCY_PLAN = "/emergency-plan",
  INVESTMENTS = "/investments",
  ADD_TRANSACTION = "/investments/add",
}

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.LOGOUT] as const;
export const PUBLIC_ROUTES = [...AUTH_ROUTES, ROUTES.HOME] as const;
