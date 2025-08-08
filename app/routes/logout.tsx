import { createClient } from "app/utils/supabase.server";
import { redirect } from "react-router";

import { ROUTES } from "#/constants/routes";
import type { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);

  await supabase.auth.signOut();

  return redirect(ROUTES.HOME, { headers });
}
