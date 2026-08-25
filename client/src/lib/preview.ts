/**
 * Pre-launch preview bypass.
 *
 * While COMING_SOON is true the holding page takes over every route. This lets a
 * named person — Mark reviewing the build, a director, the marketing teams — see
 * the real site without taking the holding page down for everyone.
 *
 *   https://teb-academy.com/?preview=eba2026
 *
 * The flag is held in sessionStorage for that browser tab, so internal navigation
 * keeps working and the URL stays clean after the first hit. Closing the tab ends it.
 *
 * NOT a security control. The key ships in the public JavaScript bundle, so anyone
 * reading the source can find it — it is a convenience that stops casual visitors and
 * crawlers seeing an unfinished site, nothing more. Do not put anything behind it
 * that would actually matter if a stranger saw it.
 *
 * Why this and not simply flipping COMING_SOON off for an hour: nothing has to be
 * remembered afterwards. A flag flipped "just for a review" is the kind of thing that
 * is still flipped a fortnight later.
 */

const KEY = "eba_preview";
const PASS = "eba2026";

/** True when this tab has been granted preview access. */
export function isPreview(): boolean {
  if (typeof window === "undefined") return false;   // prerender/SSR: never preview
  try {
    const q = new URLSearchParams(window.location.search).get("preview");
    if (q === PASS) {
      sessionStorage.setItem(KEY, "1");
      return true;
    }
    if (q !== null && q !== PASS) return false;      // wrong key — holding page
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;                                     // storage blocked — fail closed
  }
}
