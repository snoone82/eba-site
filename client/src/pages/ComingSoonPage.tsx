/**
 * ComingSoonPage — the pre-launch holding page.
 *
 * Active while COMING_SOON is true in constants.ts. When true, App.tsx serves this
 * for EVERY route, so nothing unfinished is reachable — no purchase paths, no draft
 * course, no half-written pages.
 *
 * Why a holding page rather than taking the site down:
 *   - the domain keeps resolving, so the three social profiles don't link to nothing
 *   - Google can start indexing the domain (indexing takes weeks, launch is close)
 *   - interest converts into a waitlist instead of being lost
 *
 * Deliberately NOT here: any price, any purchase CTA, any claim about what the course
 * contains. Enrolment is closed and the course is not deliverable yet — this page
 * promises a launch date and nothing more.
 *
 * TO REMOVE AT LAUNCH: set COMING_SOON = false in constants.ts. That is the whole job.
 */

import { useState } from "react";
import { EBALogo } from "@/components/EBALogo";
import { useIsMobile } from "@/hooks/useMobile";
import {
  NAVY, NAVY_RGB, CREAM, CREAM_RGB, WHITE,
  RUST, SKY, ACCENT_GRAD,
  TAGLINE, LAUNCH_DATE_LABEL, SOCIAL_LINKS, FORM_ENDPOINT, isPlaceholder,
} from "@/lib/constants";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track } from "@/lib/track";
import { getStoredUtm } from "@/lib/track";

const BRASS = "#C9982E";

export function ComingSoonPage() {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  // Fail safe: with no endpoint wired we say so, rather than faking a signup.
  const formReady = !isPlaceholder(FORM_ENDPOINT);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "waitlist:pre-launch",
          ...getStoredUtm(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("waitlist_submit");
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: NAVY, color: WHITE,
      fontFamily: "'Poppins', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      <Seo {...PAGE_SEO.comingSoon} />

      {/* Brand gradient hairline — the one sanctioned gradient use. */}
      <div style={{ height: "4px", background: ACCENT_GRAD, flexShrink: 0 }} />

      <main style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        maxWidth: "720px", width: "100%", margin: "0 auto",
        padding: isMobile ? "56px 24px" : "80px 40px",
      }}>
        <div style={{ marginBottom: isMobile ? "40px" : "56px" }}>
          <EBALogo height={isMobile ? 58 : 76} light />
        </div>

        <p style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em",
          textTransform: "uppercase", color: BRASS, margin: "0 0 18px",
        }}>
          Launching {LAUNCH_DATE_LABEL}
        </p>

        <h1 style={{
          fontFamily: "var(--eba-heading)", fontWeight: 900,
          fontSize: isMobile ? "2.1rem" : "3.2rem",
          letterSpacing: "-0.025em", lineHeight: 1.05,
          margin: "0 0 22px", textWrap: "balance",
        }}>
          {TAGLINE}
        </h1>

        <p style={{
          fontSize: isMobile ? "16px" : "18px", lineHeight: 1.7,
          color: `rgba(${CREAM_RGB},0.74)`, margin: "0 0 8px", maxWidth: "56ch",
        }}>
          Business growth and AI tools for engineering services contractors —
          mechanical, electrical and M&amp;E.
        </p>
        <p style={{
          fontSize: isMobile ? "16px" : "18px", lineHeight: 1.7,
          color: `rgba(${CREAM_RGB},0.74)`, margin: "0 0 40px", maxWidth: "56ch",
        }}>
          We're finishing the build. Leave your email and you'll hear first when
          the founding cohort opens.
        </p>

        {/* ── Waitlist ── */}
        {!formReady ? (
          <p style={{ color: BRASS, fontSize: "15px", fontWeight: 600, margin: 0 }}>
            Waitlist opens shortly — check back soon.
          </p>
        ) : state === "done" ? (
          <div style={{
            border: `1px solid ${SKY}`, borderRadius: "10px",
            padding: "20px 24px", background: "rgba(43,199,181,0.08)",
          }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "16px", color: SKY }}>
              You're on the list.
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "15px", color: `rgba(${CREAM_RGB},0.74)` }}>
              We'll email you when enrolment opens. Nothing else — no newsletter, no noise.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ maxWidth: "480px" }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px" }}>
              <label htmlFor="waitlist-email" style={{
                position: "absolute", width: "1px", height: "1px",
                overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap",
              }}>
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@yourcompany.co.uk"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, padding: "14px 16px", fontSize: "15px",
                  fontFamily: "'Poppins', sans-serif",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: "8px", color: WHITE, outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={state === "loading"}
                style={{
                  background: BRASS, color: NAVY, border: "none",
                  padding: "14px 28px", fontSize: "15px", fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif", borderRadius: "8px",
                  cursor: state === "loading" ? "wait" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {state === "loading" ? "Adding…" : "Join the waitlist"}
              </button>
            </div>
            {state === "error" && (
              <p style={{ color: "#FF9F1C", fontSize: "14px", margin: "12px 0 0" }}>
                Something went wrong. Try again, or email us and we'll add you manually.
              </p>
            )}
          </form>
        )}
      </main>

      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.12)",
        padding: isMobile ? "24px" : "28px 40px",
        maxWidth: "720px", width: "100%", margin: "0 auto",
        display: "flex", flexWrap: "wrap", gap: "16px",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "13px", color: `rgba(${CREAM_RGB},0.5)` }}>
          © 2026 The Engineering Business Academy
        </span>
        {SOCIAL_LINKS.length > 0 && (
          <div style={{ display: "flex", gap: "18px" }}>
            {SOCIAL_LINKS.map(url => {
              const name = url.includes("facebook") ? "Facebook"
                : url.includes("instagram") ? "Instagram"
                : url.includes("youtube") ? "YouTube"
                : url.includes("linkedin") ? "LinkedIn" : "Social";
              return (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "13px", color: `rgba(${CREAM_RGB},0.66)`, textDecoration: "none" }}
                >
                  {name}
                </a>
              );
            })}
          </div>
        )}
      </footer>
    </div>
  );
}
