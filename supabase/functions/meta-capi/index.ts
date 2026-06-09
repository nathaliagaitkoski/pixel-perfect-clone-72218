// Meta Conversions API forwarder
// Receives events from the browser and forwards them to Meta with
// hashed user data + IP/UA so that the Pixel + CAPI deduplicate
// via event_id and match quality goes up.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const PIXEL_ID = "26649058824744575";
const ACCESS_TOKEN = Deno.env.get("META_CAPI_ACCESS_TOKEN");
const TEST_EVENT_CODE = Deno.env.get("META_CAPI_TEST_EVENT_CODE"); // optional
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashIfPresent(v?: string | null): Promise<string | undefined> {
  if (!v) return undefined;
  return await sha256(v);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Lightweight auth: validate the bearer token is a valid JWT issued by
    // this Supabase project (anon or authenticated user). Blocks anonymous
    // direct callers from polluting Meta CAPI events.
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : "";
    if (!token) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!ACCESS_TOKEN) {
      console.error("[meta-capi] META_CAPI_ACCESS_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "internal_error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      event_name,
      event_id,
      event_source_url,
      user_data = {},
      custom_data = {},
      action_source = "website",
    } = body ?? {};

    if (!event_name || !event_id) {
      return new Response(
        JSON.stringify({ error: "event_name and event_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Client IP — Supabase Edge passes original IP in x-forwarded-for
    const fwd = req.headers.get("x-forwarded-for") ?? "";
    const client_ip = fwd.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "";
    const client_ua = user_data.client_user_agent || req.headers.get("user-agent") || "";

    const ud: Record<string, unknown> = {
      client_ip_address: client_ip || undefined,
      client_user_agent: client_ua || undefined,
      fbp: user_data.fbp || undefined,
      fbc: user_data.fbc || undefined,
      em: await hashIfPresent(user_data.email),
      ph: await hashIfPresent(user_data.phone?.replace(/\D/g, "")),
      fn: await hashIfPresent(user_data.first_name),
      ln: await hashIfPresent(user_data.last_name),
      ct: await hashIfPresent(user_data.city),
      st: await hashIfPresent(user_data.state),
      zp: await hashIfPresent(user_data.zip),
      country: await hashIfPresent(user_data.country),
      external_id: await hashIfPresent(user_data.external_id),
    };
    for (const k of Object.keys(ud)) if (ud[k] === undefined) delete ud[k];

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url,
          action_source,
          user_data: ud,
          custom_data,
        },
      ],
    };
    if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("[meta-capi] Meta error", r.status, json);
      return new Response(JSON.stringify({ error: "upstream_error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[meta-capi] error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
