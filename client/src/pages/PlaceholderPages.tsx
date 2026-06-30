import { Link } from "wouter";
import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import {
  NAVY, CREAM, RUST, OAT,
  ENROL_HREF, ENROL_READY, ENROL_PENDING_LABEL,
  MENTOR_INTAKES, MENTOR_CAPACITY, FORM_ENDPOINT, isPlaceholder,
  DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB,
  IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, NAV_RGB,
} from "@/lib/constants";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track, getStoredUtm } from "@/lib/track";

function PlaceholderNav({ active }: { active: string }) {
  const links = [
    { href: "/academy", label: "Academy" },
    { href: "/ai-tools", label: "AI Tools" },
    { href: "/our-story", label: "Our Story" },
    { href: "/documents", label: "Documents" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <nav className="eba-desktop-nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: `rgba(${NAV_RGB},0.97)`, backdropFilter: "blur(12px)",
      borderBottom: `1px solid rgba(${RUST_RGB},0.15)`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: "60px",
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" fill="#1b2632"/>
          <path d="M20 20 L50 10 L80 20 L80 80 L50 90 L20 80 Z" fill="#a35139" opacity="0.9"/>
          <text x="50" y="58" textAnchor="middle" fill="white" fontFamily="serif" fontWeight="900" fontSize="28">EBA</text>
        </svg>
      </Link>
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px",
            letterSpacing: "0.04em", textDecoration: "none",
            color: l.href === active ? RUST : `rgba(${CREAM_RGB},0.7)`,
          }}>
            {l.label}
          </Link>
        ))}
        <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
          background: CTA_PRIMARY_BG, color: "#fff", textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "12px",
          padding: "9px 20px", letterSpacing: "0.06em",
        }}>
          {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
        </a>
      </div>
    </nav>
  );
}

function PlaceholderHero({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <section style={{ paddingTop: "120px", paddingBottom: "80px", background: DARK_GRADIENT }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
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
    <footer style={{ background: DARK_GRADIENT, padding: "40px", borderTop: `1px solid rgba(${RUST_RGB},0.2)` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: `rgba(${CREAM_RGB},0.4)`, margin: 0 }}>
          © 2025 The Engineering Business Academy. All rights reserved.
        </p>
        <Link href="/" style={{ color: RUST, fontFamily: "'DM Sans', sans-serif", fontSize: "12px", textDecoration: "none" }}>
          ← Back to home
        </Link>
      </div>
    </footer>
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
            const statusText = isOpen
              ? "Now enrolling — limited places"
              : isFull
                ? "Fully booked"
                : "Register interest";
            const statusColor = isOpen ? RUST : isFull ? `rgba(${CREAM_RGB},0.7)` : `rgba(${NAVY_RGB},0.55)`;
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
                    background: "transparent", color: `rgba(${CREAM_RGB},0.8)`, border: `1px solid rgba(${CREAM_RGB},0.4)`,
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
                    Register for this intake →
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
                    {m.label}{m.status === "full" ? " — waitlist" : m.status === "open" ? " — now enrolling" : ""}
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
      />
      <section style={{ background: CREAM, padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginBottom: "64px" }}>
            {[
              {
                label: "Group Mentorship",
                detail: "Monthly sessions with a small, curated cohort of M&E business owners. Structured around shared commercial challenges — pricing, cash flow, contract management, growth. Each session is facilitated by Mark and limited to six participants to ensure substantive discussion.",
                price: "Pricing on application",
              },
              {
                label: "1:1 Mentorship",
                detail: "Fortnightly sessions working directly with Mark on your business. Suitable for principals at an inflection point — scaling, restructuring, preparing for exit, or navigating a specific commercial or operational challenge. Application-only. Limited to a small number of principals at any one time.",
                price: "Pricing on application",
              },
            ].map(({ label, detail, price }) => (
              <div key={label} style={{ background: "#fff", borderTop: `3px solid ${RUST}`, padding: "32px 28px" }}>
                <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.2rem", color: NAVY, margin: "0 0 14px" }}>
                  {label}
                </h3>
                <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "14px", lineHeight: 1.75, margin: "0 0 20px" }}>
                  {detail}
                </p>
                <span style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST, fontSize: "14px" }}>
                  {price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MentorWaitlist />
      <PlaceholderFooter />
    </div>
  );
}

export function PricingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.pricing} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/pricing" />
      <PlaceholderHero
        label="Pricing"
        title="Transparent pricing. No hidden fees."
        sub="Three ways to access the Engineering Business Academy — from self-paced study to full mentorship with Mark. Pricing for the founding cohort is fixed and will not be offered again."
      />
      <ComingSoonBody message="Full pricing detail is being finalised. To be notified when the founding cohort opens, or to discuss your requirements, please register your interest below." />
      <PlaceholderFooter />
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
      a: "Yes. The O&M Manual Compiler and Compliance Chatbot are available as standalone subscriptions. Details are on the AI Tools page.",
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
      <section style={{ background: OAT, padding: "80px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2px" }}>
          {faqs.map(({ q, a }) => (
            <div key={q} style={{ background: "#fff", padding: "28px 32px", borderLeft: `3px solid ${RUST}` }}>
              <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.05rem", color: NAVY, margin: "0 0 10px" }}>
                {q}
              </h3>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14px", lineHeight: 1.75, margin: 0 }}>
                {a}
              </p>
            </div>
          ))}
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
