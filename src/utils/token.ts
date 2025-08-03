import Cookies from 'js-cookie';

import { COOKIE_KEYS } from '../constants/keys.ts';

export function getAccessToken(): string | null {
  return Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) || null;
}

export function setAccessToken(token: string, expires: Date | undefined): void {
  Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, token, { expires });
}
