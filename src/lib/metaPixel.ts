// Helpers para disparar eventos no Meta Pixel + Conversions API
// usando o mesmo event_id (deduplicação) e advanced matching.
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function getOrCreateExternalId(): string {
  try {
    const k = "_pc_eid";
    let v = localStorage.getItem(k);
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem(k, v);
    }
    return v;
  } catch {
    return crypto.randomUUID();
  }
}

function newEventId(): string {
  return crypto.randomUUID();
}

export type MetaUserData = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export async function trackMeta(
  event_name: string,
  custom_data: Record<string, unknown> = {},
  user_data: MetaUserData = {},
) {
  const event_id = newEventId();
  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");
  const external_id = getOrCreateExternalId();

  // 1) Pixel (browser) — com eventID para deduplicação
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      const amObj: Record<string, string> = {};
      if (user_data.email) amObj.em = user_data.email.trim().toLowerCase();
      if (user_data.phone) amObj.ph = user_data.phone.replace(/\D/g, "");
      if (user_data.first_name) amObj.fn = user_data.first_name.trim().toLowerCase();
      if (user_data.last_name) amObj.ln = user_data.last_name.trim().toLowerCase();
      if (user_data.city) amObj.ct = user_data.city.trim().toLowerCase();
      if (user_data.state) amObj.st = user_data.state.trim().toLowerCase();
      if (user_data.zip) amObj.zp = user_data.zip.replace(/\D/g, "");
      if (user_data.country) amObj.country = user_data.country.trim().toLowerCase();
      amObj.external_id = external_id;

      // fbq permite passar advanced matching no setUserProperties
      window.fbq("init", "26649058824744575", amObj);
      window.fbq("track", event_name, custom_data, { eventID: event_id });
    }
  } catch (e) {
    console.warn("[meta] pixel error", e);
  }

  // 2) Conversions API (server)
  try {
    await supabase.functions.invoke("meta-capi", {
      body: {
        event_name,
        event_id,
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        custom_data,
        user_data: {
          ...user_data,
          fbp,
          fbc,
          external_id,
          client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        },
      },
    });
  } catch (e) {
    console.warn("[meta] capi error", e);
  }
}
