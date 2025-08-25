export enum ROUTES {
  HOME = "/",
  LOGIN = "/login",
  LOGOUT = "/logout",
  OVERVIEW = "/overview",
  SIP_BREAKDOWN = "sip-breakdown",
  CATEGORY_DETAILS = "/overview/category/:category",
  INVESTMENTS = "/investments",
  ADD_TRANSACTION = "/investments/add",
}

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.LOGOUT] as const;
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.LOGOUT,
] as const;
