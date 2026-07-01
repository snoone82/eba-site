import { Link } from "wouter";
import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { EBALogo } from "@/components/EBALogo";
import {
  NAVY, CREAM, RUST, OAT, WHITE,
  ENROL_HREF, ENROL_READY, ENROL_PENDING_LABEL,
  MENTOR_INTAKES, MENTOR_CAPACITY, FORM_ENDPOINT, isPlaceholder,
  DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB,
  IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, CTA_BAND_BG, NAV_RGB,
  HERO_GLOW, SECTION_GLOW, SECTION_TINT, ORB_ACCENT,
  NAV_BAR_BG, NAV_LINK, NAV_LINK_ACTIVE, NAV_BORDER, NAV_CTA_BG, NAV_CTA_TEXT,
} from "@/lib/constants";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { CtaBanner } from "@/components/CtaBanner";
import { SectionBreaker } from "@/components/SectionBreaker";
import { Photo } from "@/components/Photo";
import { useIsMobile } from "@/hooks/useMobile";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track, getStoredUtm } from "@/lib/track";
import { ChevronDown } from "lucide-react";

function PlaceholderNav({ active }: { active: string }) {
  const links = [
    { href: "/academy", label: "Academy" },
    { href: "/ai-tools", label: "AI Tools" },
    { href: "/documents", label: "Documents" },
    { href: "/mentorship", label: "Mentorship" },
    { href: "/our-story", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <nav className="eba-desktop-nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: NAV_BAR_BG,
      borderBottom: `1px solid ${NAV_BORDER}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: "60px",
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
        <EBALogo height={34} light navOnCobalt />
      </Link>
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px",
            letterSpacing: "0.04em", textDecoration: "none",
            color: l.href === active ? NAV_LINK_ACTIVE : NAV_LINK,
          }}>
            {l.label}
          </Link>
        ))}
        <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
          background: NAV_CTA_BG, color: NAV_CTA_TEXT, textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "12px",
          padding: "9px 20px", letterSpacing: "0.06em", borderRadius: "10px",
        }}>
          {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
        </a>
      </div>
    </nav>
  );
}

function PlaceholderHero({ label, title, sub, portrait, portraitAlt }: { label: string; title: string; sub: string; portrait?: string; portraitAlt?: string }) {
  const isMobile = useIsMobile();
  const hasPortrait = !!portrait && !isMobile;
  return (
    <section style={{ position: "relative", overflow: "hidden", paddingTop: "128px", paddingBottom: "72px", background: DARK_GRADIENT }}>
      {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW }} />}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "0 40px",
        display: hasPortrait ? "grid" : "block",
        gridTemplateColumns: hasPortrait ? "1.2fr 0.8fr" : undefined,
        gap: hasPortrait ? "56px" : undefined, alignItems: "center",
      }}>
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px",
            letterSpacing: "0.12em", textTransform: "uppercase", color: RUST, margin: "0 0 20px",
          }}>{label}</p>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05, maxWidth: "700px",
          }}>{title}</h1>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "580px" }}>
            {sub}
          </p>
        </div>
        {hasPortrait && (
          <div className="eba-hero-portrait" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-18px", background: ORB_ACCENT || "none", filter: "blur(10px)", borderRadius: "24px", zIndex: 0 }} />
            <img
              src={portrait}
              alt={portraitAlt || ""}
              style={{ position: "relative", zIndex: 1, width: "100%", borderRadius: "18px", display: "block", boxShadow: "0 40px 80px -40px rgba(0,0,0,0.6)" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function ComingSoonBody({ message }: { message: string }) {
  return (
    <section style={{ background: OAT, padding: "100px 40px", minHeight: "50vh" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ borderLeft: `4px solid ${RUST}`, paddingLeft: "28px" }}>
          <p style={{
            fontFamily: "var(--eba-heading)", fontStyle: "italic",
            fontSize: "1.25rem", lineHeight: 1.7, color: NAVY, margin: "0 0 32px",
          }}>{message}</p>
          <Link href="/contact" style={{
            background: CTA_DARK_BG, color: "#fff", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
            padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
          }}>
            Register your interest →
          </Link>
        </div>
      </div>
    </section>
  );
}

function PlaceholderFooter() {
  return (
    <SiteFooter />
  );
}

// ── Mentor availability + waitlist (real scarcity, honest fail-safe) ──────────
function MentorWaitlist() {
  const openIntake = MENTOR_INTAKES.find((m) => m.status === "open");
  const openMonth = openIntake?.label;
  const [selectedMonth, setSelectedMonth] = useState(openMonth || MENTOR_INTAKES[0]?.label || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formReady = !isPlaceholder(FORM_ENDPOINT);

  const choose = (month: string, isOpen: boolean) => {
    setSelectedMonth(month);
    if (isOpen) track("cta_mentor_enrol", { month });
    const el = document.getElementById("mentor-waitlist");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          interest: "mentorship",
          month: selectedMonth,
          ...getStoredUtm(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      track("mentor_waitlist_submit", { month: selectedMonth });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again, or use the contact form.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#fff", border: `1px solid rgba(${NAVY_RGB},0.2)`,
    padding: "13px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
    color: NAVY, outline: "none", boxSizing: "border-box",
  };

  return (
    <section style={{ background: OAT, padding: "80px 40px" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>
        {/* Honest scarcity line — capacity, not fake history */}
        <span style={{
          display: "inline-block", background: RUST, color: "#fff",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "11px",
          letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 14px", marginBottom: "20px",
        }}>Availability</span>
        <h2 style={{
          fontFamily: "var(--eba-heading)", fontWeight: 800,
          fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em",
          color: NAVY, margin: "0 0 16px", lineHeight: 1.1,
        }}>
          Mentorship is deliberately limited.
        </h2>
        <p style={{ color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16px", lineHeight: 1.7, maxWidth: "640px", margin: "0 0 40px" }}>
          So Mark can give real 1:1 time, each cohort is{" "}
          {isPlaceholder(MENTOR_CAPACITY) ? "kept deliberately small" : `capped at ${MENTOR_CAPACITY}`}.
          When a month is full, it's full.{openMonth ? ` The next intake is ${openMonth}.` : ""}
        </p>

        {/* Intake rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "56px" }}>
          {MENTOR_INTAKES.map((intake) => {
            const isOpen = intake.status === "open";
            const isFull = intake.status === "full";
            const rowBg = isOpen ? "#fff" : isFull ? NAVY : "#fff";
            const borderLeft = isOpen
              ? `3px solid ${RUST}`
              : isFull
                ? `3px solid rgba(${RUST_RGB},0.4)`
                : `3px solid ${OAT}`;
            const monthColor = isFull ? "#fff" : NAVY;
            // Until the waitlist endpoint is live we cannot honestly say "now
            // enrolling" — the open intake presents as the next intake to
            // register interest in, matching the form's "opening soon" state.
            const statusText = isOpen
              ? (formReady ? "Now enrolling — limited places" : "Next intake — register interest")
              : isFull
                ? "Fully booked"
                : "Dates released soon";
            // Full rows are a solid black band on every theme — force white text
            // (CREAM_RGB is 0,0,0 in the vivid/light family, which would vanish).
            const statusColor = isOpen ? RUST : isFull ? "rgba(255,255,255,0.75)" : `rgba(${NAVY_RGB},0.55)`;
            return (
              <div key={intake.label} style={{
                background: rowBg, borderLeft, border: isOpen ? `1px solid ${RUST}` : `1px solid rgba(${NAVY_RGB},0.08)`,
                padding: "20px 24px", display: "flex", flexWrap: "wrap", alignItems: "center",
                justifyContent: "space-between", gap: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {isFull && (
                    <span style={{ width: "9px", height: "9px", background: RUST, display: "inline-block", flexShrink: 0 }} />
                  )}
                  <span style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.15rem", color: monthColor }}>
                    {intake.label}
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12px",
                    letterSpacing: "0.06em", textTransform: "uppercase", color: statusColor,
                  }}>
                    {statusText}
                  </span>
                </div>
                {isFull ? (
                  <button onClick={() => choose(intake.label, false)} style={{
                    background: "transparent", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.4)",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12px",
                    letterSpacing: "0.04em", padding: "8px 16px", cursor: "pointer",
                  }}>
                    Join the waitlist →
                  </button>
                ) : isOpen ? (
                  <button onClick={() => choose(intake.label, true)} style={{
                    background: CTA_PRIMARY_BG, color: "#fff", border: "none",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px",
                    letterSpacing: "0.04em", padding: "10px 22px", cursor: "pointer",
                  }}>
                    {formReady ? "Register for this intake →" : "Register interest →"}
                  </button>
                ) : (
                  <button onClick={() => choose(intake.label, false)} style={{
                    background: "transparent", color: NAVY, border: `1px solid ${NAVY}`,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12px",
                    letterSpacing: "0.04em", padding: "8px 16px", cursor: "pointer",
                  }}>
                    Register interest →
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Waitlist form */}
        <div id="mentor-waitlist" style={{ background: DARK_GRADIENT, padding: "40px", maxWidth: "560px", scrollMarginTop: "80px" }}>
          {!formReady ? (
            <>
              <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.5rem", color: ON_DARK, margin: "0 0 12px" }}>
                Registration opening soon.
              </h3>
              <p style={{ color: `rgba(${CREAM_RGB},0.7)`, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                The mentorship waitlist opens shortly. In the meantime you can reach us via the{" "}
                <Link href="/contact" style={{ color: RUST }}>contact form</Link>.
                {/* TODO(eba): set FORM_ENDPOINT in constants.ts to enable the waitlist. */}
              </p>
            </>
          ) : submitted ? (
            <>
              <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.5rem", color: ON_DARK, margin: "0 0 12px" }}>
                You're on the list for {selectedMonth}.
              </h3>
              <p style={{ color: `rgba(${CREAM_RGB},0.7)`, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                We'll be in touch when places open.
              </p>
            </>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.5rem", color: ON_DARK, margin: "0 0 4px" }}>
                Register your interest.
              </h3>
              <label style={{ color: `rgba(${CREAM_RGB},0.7)`, fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Intake
              </label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={inputStyle}>
                {MENTOR_INTAKES.map((m) => (
                  <option key={m.label} value={m.label}>
                    {m.label}{m.status === "full" ? " — waitlist" : m.status === "open" ? (formReady ? " — now enrolling" : " — next intake") : " — dates soon"}
                  </option>
                ))}
              </select>
              <input type="text" placeholder="Your first name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
              <input type="email" placeholder="Your business email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              {error && <p style={{ color: "#FFB162", fontSize: "13px", margin: 0 }} role="alert">{error}</p>}
              <button type="submit" disabled={loading} style={{
                background: CTA_PRIMARY_BG, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px",
                padding: "14px 28px", letterSpacing: "0.04em", opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Sending..." : "Join the waitlist →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function MentorshipPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.mentorship} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/mentorship" />
      <PlaceholderHero
        label="Mentorship"
        title="Direct access to Mark Poulton."
        sub="For M&E business owners who require more than a structured programme. Group and 1:1 mentorship with Mark — working directly on your business, your commercial position, and your specific challenges. Places are strictly limited and allocated by application."
        portrait="/mark-mentoring.jpg"
        portraitAlt="Mark Poulton leading a group mentorship session"
      />
      <section style={{ position: "relative", overflow: "hidden", background: SECTION_TINT, backgroundImage: SECTION_GLOW, padding: "80px 40px" }}>
        <AmbientOrbs />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "8px" }}>
            {[
              {
                label: "Group Mentorship",
                detail: "Monthly sessions with a small, curated cohort of M&E business owners. Structured around shared commercial challenges — pricing, cash flow, contract management, growth. Each session is facilitated by Mark and limited to six participants to ensure substantive discussion.",
                price: "Pricing on application",
                img: "/mark-teaching.jpg",
                imgAlt: "Mark Poulton facilitating a group mentorship session",
              },
              {
                label: "1:1 Mentorship",
                detail: "Fortnightly sessions working directly with Mark on your business. Suitable for principals at an inflection point — scaling, restructuring, preparing for exit, or navigating a specific commercial or operational challenge. Application-only. Limited to a small number of principals at any one time.",
                price: "Pricing on application",
                img: "/mark-seated.jpg",
                imgAlt: "Mark Poulton in a one-to-one mentoring session",
              },
            ].map(({ label, detail, price, img, imgAlt }) => (
              <div key={label} style={{ background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.09)`, borderRadius: "18px", padding: "0", overflow: "hidden", boxShadow: "0 20px 46px -32px rgba(0,0,0,0.26)" }}>
                <Photo src={img} alt={imgAlt} ratio="16 / 9" radius="0" shadow={false} />
                <div style={{ padding: "28px 30px 32px" }}>
                <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.3rem", color: NAVY, margin: "0 0 14px" }}>
                  {label}
                </h3>
                <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "14px", lineHeight: 1.75, margin: "0 0 20px" }}>
                  {detail}
                </p>
                <span style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST, fontSize: "14px" }}>
                  {price}
                </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MentorWaitlist />
      <CtaBanner
        title="Not sure which route fits your business?"
        sub="Tell us where you are and what you're trying to solve. We'll point you to the right level — Academy, documents, or mentorship with Mark."
        cta="Talk to us"
        href="/contact"
        eventName="cta_banner_mentorship"
      />
      <PlaceholderFooter />
    </div>
  );
}

const PRICING_TIERS = [
  {
    name: "Founding Academy",
    tag: "The full curriculum, for life.",
    popular: false,
    features: [
      "101-lesson curriculum, 10 modules",
      "Lifetime access at the founding price",
      "All future updates included",
      "Founding group session with Mark",
    ],
  },
  {
    name: "Academy + Documents",
    tag: "Everything you need to run the business.",
    popular: true,
    features: [
      "Everything in Founding Academy",
      "Full 380-document library (Word + PDF)",
      "All future document additions",
    ],
  },
  {
    name: "Academy + Docs + Mentorship",
    tag: "The complete package, with Mark alongside you.",
    popular: false,
    features: [
      "Everything in Academy + Documents",
      "12 months of group mentorship",
      "Priority for a 1:1 session with Mark",
    ],
  },
];

export function PricingPage() {
  const border = `rgba(${NAVY_RGB},0.10)`;
  const sub = `rgba(${NAVY_RGB},0.62)`;
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.pricing} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/pricing" />
      <PlaceholderHero
        label="Founding Cohort Pricing"
        title="More depth than a course. Less than a coaching retainer."
        sub="Three ways in — from the full curriculum to complete access with Mark alongside you. Founding members lock in the lowest price the Academy will ever be, for life."
      />

      {/* ── TIERS ── */}
      <section style={{ backgroundColor: CREAM, backgroundImage: SECTION_GLOW, padding: "72px 20px 40px" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", alignItems: "stretch" }}>
            {PRICING_TIERS.map(tier => (
              <div key={tier.name} style={{
                position: "relative", background: WHITE,
                border: tier.popular ? `2px solid ${RUST}` : `1px solid ${border}`,
                borderRadius: "22px", padding: "34px 30px 32px",
                display: "flex", flexDirection: "column",
                boxShadow: tier.popular ? "0 40px 80px -40px rgba(0,0,0,0.35)" : "0 20px 44px -30px rgba(0,0,0,0.25)",
              }}>
                {tier.popular && (
                  <span style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: CTA_PRIMARY_BG, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 16px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                    Most popular
                  </span>
                )}
                <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.01em", color: NAVY, margin: "0 0 6px" }}>{tier.name}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: sub, margin: "0 0 22px", lineHeight: 1.5 }}>{tier.tag}</p>
                <div style={{ marginBottom: "22px" }}>
                  <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 900, fontSize: "1.6rem", color: NAVY, lineHeight: 1.1 }}>Announced soon</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12.5px", color: RUST, fontWeight: 600, marginTop: "4px" }}>Founding price · locked for life · rises after launch</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "28px" }}>
                  {tier.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: `rgba(${RUST_RGB},0.12)`, color: RUST, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "11px", fontWeight: 800, marginTop: "1px" }}>✓</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: `rgba(${NAVY_RGB},0.75)`, lineHeight: 1.45 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("checkout_click", { source: "pricing", tier: tier.name })} style={{
                  marginTop: "auto", textAlign: "center",
                  background: tier.popular ? CTA_PRIMARY_BG : "transparent",
                  color: tier.popular ? "#fff" : NAVY,
                  border: tier.popular ? "none" : `1px solid rgba(${NAVY_RGB},0.25)`,
                  textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px",
                  padding: "13px 24px", letterSpacing: "0.03em", display: "block",
                }}>
                  {ENROL_READY ? "Join the founding cohort →" : "Register your interest →"}
                </a>
              </div>
            ))}
          </div>

          {/* Reassurance strip */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 28px", marginTop: "40px" }}>
            {[
              "Founding price locked in for life",
              "14-day money-back guarantee",
              "M&E contractors only",
            ].map(t => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 600, color: `rgba(${NAVY_RGB},0.7)` }}>
                <span style={{ color: RUST, fontWeight: 800 }}>✓</span> {t}
              </span>
            ))}
          </div>
          <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: sub, maxWidth: "620px", margin: "28px auto 0", lineHeight: 1.6 }}>
            Founding pricing is fixed for the first cohort and rises after launch. Prices shown will be confirmed before enrolment opens. The AI tools are priced separately — pay-per-use or subscription — and are not included in Academy membership.
          </p>
        </div>
      </section>

      {/* ── SECTION BREAKER ── */}
      <SectionBreaker
        kicker="Founding cohort"
        title="Get on the list before"
        accent="prices rise."
        variant="gradient"
      />

      <SiteFooter />
    </div>
  );
}

export function EnterprisePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.enterprise} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/enterprise" />
      <PlaceholderHero
        label="Enterprise"
        title="Deploy EBA across your entire organisation."
        sub="For M&E engineering groups, principal contractors, and training providers who want to deploy the Academy curriculum and AI tools at scale. White-label licensing, group access, and managed implementation available."
      />
      <ComingSoonBody message="Enterprise licensing details are being finalised. To discuss group access, white-label deployment, or custom implementation for your organisation, please get in touch." />
      <PlaceholderFooter />
    </div>
  );
}

export function FAQPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    {
      q: "Who is the Academy for?",
      a: "M&E engineering contractors — sole traders, small businesses, and growing companies — who are technically excellent but lack the business and commercial systems to scale profitably. If you run a plumbing, electrical, HVAC, or multi-trade M&E business, this is built for you.",
    },
    {
      q: "Do I need any prior business knowledge?",
      a: "No. The Academy starts from first principles and builds systematically. The only prerequisite is that you are currently running or about to run an M&E contracting business.",
    },
    {
      q: "How long does the programme take?",
      a: "The Academy contains 101 lessons across 10 modules. Most members work through it at their own pace over 3–6 months, fitting study around their business. There is no deadline.",
    },
    {
      q: "Is this just video content?",
      a: "No. The Academy combines structured video lessons, downloadable frameworks and templates, AI tools, and — depending on your membership tier — direct access to Mark through group or 1:1 mentorship sessions.",
    },
    {
      q: "What is the founding cohort?",
      a: "The founding cohort is the first group of members to join the Academy. Founding members receive a permanently reduced price that will not be offered again, plus direct input into how the Academy develops. Places are strictly limited.",
    },
    {
      q: "Can I access the AI tools without joining the Academy?",
      a: "Yes. The O&M Manual Compiler and Compliance Co-Pilot are available on a pay-per-use or subscription basis — they are not included with Academy membership. Details are on the AI Tools page.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a 14-day refund on all Academy memberships, no questions asked. If the programme is not right for you, contact us within 14 days of purchase.",
    },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.faq} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/faq" />
      <PlaceholderHero
        label="FAQ"
        title="Frequently asked questions."
        sub="If you have a question that isn't answered here, use the contact form and we'll respond within one business day."
      />
      <section style={{ backgroundColor: IS_VIVID ? CREAM : OAT, backgroundImage: SECTION_GLOW, padding: "80px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map(({ q, a }, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={q}
                style={{
                  background: WHITE,
                  border: `1px solid rgba(${NAVY_RGB},${isOpen ? 0.16 : 0.09})`,
                  borderRadius: "14px",
                  boxShadow: isOpen ? "0 20px 40px -28px rgba(0,0,0,0.3)" : "0 8px 20px -18px rgba(0,0,0,0.25)",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%", background: "transparent", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px",
                    padding: "22px 26px", textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.05rem", color: NAVY, lineHeight: 1.3 }}>
                    {q}
                  </span>
                  <span style={{
                    flexShrink: 0, width: "30px", height: "30px", borderRadius: "50%",
                    background: isOpen ? CTA_PRIMARY_BG : `rgba(${NAVY_RGB},0.06)`,
                    color: isOpen ? "#fff" : NAVY,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 0.25s, background 0.2s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}>
                    <ChevronDown size={17} strokeWidth={2.5} />
                  </span>
                </button>
                <div style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 0.28s ease",
                }}>
                  <div style={{ overflow: "hidden" }}>
                    <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14.5px", lineHeight: 1.75, margin: 0, padding: "0 26px 24px" }}>
                      {a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section style={{ background: DARK_GRADIENT, padding: "64px 40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.8rem", color: ON_DARK, margin: "0 0 16px" }}>
            Still have questions?
          </h3>
          <p style={{ color: `rgba(${CREAM_RGB},0.7)`, fontSize: "15px", lineHeight: 1.65, margin: "0 0 28px" }}>
            Use the contact form and we'll respond within one business day.
          </p>
          <Link href="/contact" style={{
            background: CTA_PRIMARY_BG, color: "#fff", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
            padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
          }}>
            Get in touch →
          </Link>
        </div>
      </section>
      <PlaceholderFooter />
    </div>
  );
}
