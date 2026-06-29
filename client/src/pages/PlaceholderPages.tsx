import { Link } from "wouter";
import { MobileNav } from "@/components/MobileNav";
import { NAVY, CREAM, RUST, OAT, ENROL_HREF, ENROL_READY, ENROL_PENDING_LABEL } from "@/lib/constants";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track } from "@/lib/track";

function PlaceholderNav({ active }: { active: string }) {
  const links = [
    { href: "/academy", label: "Academy" },
    { href: "/ai-tools", label: "AI Tools" },
    { href: "/about", label: "About" },
    { href: "/documents", label: "Documents" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <nav className="eba-desktop-nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(27,38,50,0.97)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(163,81,57,0.15)",
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
            color: l.href === active ? RUST : "rgba(238,233,223,0.7)",
          }}>
            {l.label}
          </Link>
        ))}
        <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
          background: RUST, color: "#fff", textDecoration: "none",
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
    <section style={{ paddingTop: "120px", paddingBottom: "80px", background: NAVY }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px",
          letterSpacing: "0.12em", textTransform: "uppercase", color: RUST, margin: "0 0 20px",
        }}>{label}</p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 900,
          fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
          color: "#fff", margin: "0 0 20px", lineHeight: 1.05, maxWidth: "700px",
        }}>{title}</h1>
        <p style={{ color: "rgba(238,233,223,0.72)", fontSize: "17px", lineHeight: 1.7, maxWidth: "580px" }}>
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
            fontFamily: "'Playfair Display', serif", fontStyle: "italic",
            fontSize: "1.25rem", lineHeight: 1.7, color: NAVY, margin: "0 0 32px",
          }}>{message}</p>
          <Link href="/contact" style={{
            background: NAVY, color: "#fff", textDecoration: "none",
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
    <footer style={{ background: NAVY, padding: "40px", borderTop: `1px solid rgba(163,81,57,0.2)` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(238,233,223,0.4)", margin: 0 }}>
          © 2025 The Engineering Business Academy. All rights reserved.
        </p>
        <Link href="/" style={{ color: RUST, fontFamily: "'DM Sans', sans-serif", fontSize: "12px", textDecoration: "none" }}>
          ← Back to home
        </Link>
      </div>
    </footer>
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
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: NAVY, margin: "0 0 14px" }}>
                  {label}
                </h3>
                <p style={{ color: "rgba(27,38,50,0.7)", fontSize: "14px", lineHeight: 1.75, margin: "0 0 20px" }}>
                  {detail}
                </p>
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: RUST, fontSize: "14px" }}>
                  {price}
                </span>
              </div>
            ))}
          </div>
          <div style={{ background: NAVY, padding: "48px", maxWidth: "700px" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff", margin: "0 0 16px" }}>
              Apply for mentorship.
            </h3>
            <p style={{ color: "rgba(238,233,223,0.7)", fontSize: "15px", lineHeight: 1.65, margin: "0 0 28px" }}>
              Mentorship places are allocated by application. To register your interest or discuss your requirements, use the enquiry form.
            </p>
            <Link href="/contact" style={{
              background: RUST, color: "#fff", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
              padding: "12px 28px", letterSpacing: "0.04em", display: "inline-block",
            }}>
              Register your interest →
            </Link>
          </div>
        </div>
      </section>
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
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: NAVY, margin: "0 0 10px" }}>
                {q}
              </h3>
              <p style={{ color: "rgba(27,38,50,0.72)", fontSize: "14px", lineHeight: 1.75, margin: 0 }}>
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section style={{ background: NAVY, padding: "64px 40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff", margin: "0 0 16px" }}>
            Still have questions?
          </h3>
          <p style={{ color: "rgba(238,233,223,0.7)", fontSize: "15px", lineHeight: 1.65, margin: "0 0 28px" }}>
            Use the contact form and we'll respond within one business day.
          </p>
          <Link href="/contact" style={{
            background: RUST, color: "#fff", textDecoration: "none",
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
