import { redirect, type unstable_MiddlewareFunction } from "react-router";

import { ROUTES } from "#/constants/routes";
import { createClient } from "#/utils/supabase.server";

export const requireAuth: unstable_MiddlewareFunction<Response> = async (
  { request },
  next,
) => {
  const { supabase } = createClient(request);

  const { error } = await supabase.auth.getUser();

  if (error) {
    throw redirect(ROUTES.HOME);
  }

  return next();
};
