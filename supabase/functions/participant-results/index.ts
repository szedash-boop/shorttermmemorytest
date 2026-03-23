import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, nickname, result } = await req.json();

    if (action === "save") {
      if (!result || !result.nickname) {
        return new Response(
          JSON.stringify({ error: "Missing result data" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if exists
      const { data: existing } = await supabase
        .from("participant_results")
        .select("id")
        .ilike("nickname", result.nickname)
        .limit(1);

      const payload = {
        nickname: result.nickname,
        timestamp: result.timestamp,
        completed: result.completed,
        sections: result.sections,
      };

      let error;
      if (existing && existing.length > 0) {
        ({ error } = await supabase
          .from("participant_results")
          .update(payload)
          .eq("id", existing[0].id));
      } else {
        ({ error } = await supabase
          .from("participant_results")
          .insert(payload));
      }

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "has-completed") {
      if (!nickname) {
        return new Response(
          JSON.stringify({ completed: false }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data } = await supabase
        .from("participant_results")
        .select("completed")
        .ilike("nickname", nickname)
        .eq("completed", true)
        .limit(1);

      return new Response(
        JSON.stringify({ completed: (data && data.length > 0) }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
