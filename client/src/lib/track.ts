/**
 * EBA — analytics event helper (single source for all SDK calls).
 *
 * Every component imports `track` from here; no component calls `window.plausible`
 * directly. `track` fires a Plausible custom event (if the script is loaded) and
 * no-ops safely otherwise, so it never throws in dev or before analytics is set up.
 * Captured UTM values (see captureUtm) are attached to every event so we can see
 * which campaign/source drove each conversion.
 */

type Props = Record<string, string | number>;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const UTM_STORAGE_KEY = "eba_utm";

/**
 * Read UTM params from the URL on first load and persist them for the visit so
 * they survive internal navigation. Source/medium/campaign only — never PII.
 * Call once at app startup.
 */
export function captureUtm(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) found[key] = value;
    }
    /**
     * The landing referrer, captured once per visit alongside the UTMs.
     * This is what attributes an UNTAGGED link — someone tapping the Instagram
     * bio when nobody remembered to add utm_source. Stored only if it is
     * external, so internal navigation never overwrites the real origin.
     */
    const ref = document.referrer;
    if (ref && !ref.includes(window.location.hostname)) {
      found.referrer = ref.slice(0, 300);
    }

    if (Object.keys(found).length > 0) {
      // First write wins: the visit's original source, not the latest page.
      const existing = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (!existing || existing === "{}") {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
      }
    }
  } catch {
    /* sessionStorage unavailable (private mode etc.) — ignore */
  }
}

/** The UTM values captured this visit (empty object if none / unavailable). */
export function getStoredUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Fire a custom analytics event. Safe no-op when Plausible isn't loaded. */
export function track(event: string, props?: Props): void {
  if (typeof window === "undefined") return;
  const merged: Props = { ...getStoredUtm(), ...(props ?? {}) };
  const options = Object.keys(merged).length > 0 ? { props: merged } : undefined;
  try {
    window.plausible?.(event, options);
  } catch {
    /* never let analytics break a click */
  }
}
