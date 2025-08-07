import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    const { data: funds, error } = await supabase
      .from("mutual_fund")
      .select("fund_name, fund_code");

    if (error) {
      throw error;
    }

    for (const fund of funds) {
      try {
        const navRes = await fetch(
          `https://api.mfapi.in/mf/${fund.fund_code}/latest`,
        );
        const navData = await navRes.json();
        const { error } = await supabase
          .from("mutual_fund")
          .update({
            current_nav: navData?.data?.[0]?.nav ?? 0,
            updated_at: new Date().toISOString(),
          })
          .eq("fund_name", fund.fund_name);

        if (error) {
          throw error;
        }
      } catch (err) {
        console.error("Error updating NAV for", fund.code, err);
      }
    }

    return new Response(
      JSON.stringify({
        message: "success",
        mutual_funds_updated: funds.length,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: err?.message ?? err,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      },
    );
  }
});
