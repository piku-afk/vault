export enum ROUTES {
  HOME = "/",
  LOGIN = "/login",
  LOGOUT = "/logout",
  OVERVIEW = "/overview",
  OVERVIEW_V2 = "/overview/v2",
  SIP_BREAKDOWN = "sip-breakdown",
  CATEGORY_DETAILS = "/overview/category/:category",
  EMERGENCY_PLAN = "/emergency-plan",
  INVESTMENTS = "/investments",
  ADD_TRANSACTION = "/transactions/add",
}

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.LOGOUT] as const;
export const PUBLIC_ROUTES = [...AUTH_ROUTES, ROUTES.HOME] as const;
