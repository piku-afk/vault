import { redirect } from "react-router";

import { createClient } from "#/utils/supabase.server";

export async function requireAuth(request: Request) {
  const { supabase } = createClient(request);

  const { error } = await supabase.auth.getUser();

  if (error) {
    throw redirect("/");
  }
}
