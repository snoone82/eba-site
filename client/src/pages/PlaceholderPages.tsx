import { Link } from "wouter";
import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { EBALogo } from "@/components/EBALogo";
import {
  NAVY, CREAM, RUST, OAT, WHITE, COBALT, COBALT_RGB,
  ENROL_HREF, ENROL_READY, ENROL_PENDING_LABEL, PRICING, TOOL_CHECKOUT,
  ENROL_DOCS_READY, ENROL_DOCS_HREF, LEADERSHIP_TEAM, MARK_PHOTO_MENTORSHIP,
  MENTOR_INTAKES, MENTOR_CAPACITY, FORM_ENDPOINT, isPlaceholder,
  DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB,
  IS_VIVID, ON_DARK, ON_DARK_RGB, RUST_ON_DARK, CTA_DARK_BG, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT, CTA_BAND_BG, NAV_RGB,
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
    { href: "/pricing", label: "Pricing" },
    { href: "/our-story", label: "Our Story" },
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
        <EBALogo height={44} light navOnCobalt />
      </Link>
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "13px",
            letterSpacing: "0.04em", textDecoration: "none",
            color: l.href === active ? NAV_LINK_ACTIVE : NAV_LINK,
          }}>
            {l.label}
          </Link>
        ))}
        <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
          background: NAV_CTA_BG, color: NAV_CTA_TEXT, textDecoration: "none",
          fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "12px",
          padding: "9px 20px", letterSpacing: "0.06em", borderRadius: "10px",
        }}>
          {ENROL_READY ? "Join the Academy" : ENROL_PENDING_LABEL}
        </a>
      </div>
    </nav>
  );
}

type HeroCta = { label: string; href: string; secondary?: boolean; event?: string };
function PlaceholderHero({ label, title, sub, portrait, portraitAlt, ctas }: { label: string; title: string; sub: string | string[]; portrait?: string; portraitAlt?: string; ctas?: HeroCta[] }) {
  const isMobile = useIsMobile();
  const hasPortrait = !!portrait && !isMobile;
  const paras = Array.isArray(sub) ? sub : [sub];
  return (
    <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "96px" : "128px", paddingBottom: isMobile ? "56px" : "72px", background: DARK_GRADIENT }}>
      {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW }} />}
      <div style={{
        position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px",
        display: hasPortrait ? "grid" : "block",
        gridTemplateColumns: hasPortrait ? "1.2fr 0.8fr" : undefined,
        gap: hasPortrait ? "56px" : undefined, alignItems: "center",
      }}>
        <div>
          <p style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "11px",
            letterSpacing: "0.12em", textTransform: "uppercase", color: RUST_ON_DARK, margin: "0 0 20px",
          }}>{label}</p>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 20px", lineHeight: 1.05, maxWidth: "700px",
          }}>{title}</h1>
          {paras.map((p, i) => (
            <p key={i} style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "17px", lineHeight: 1.7, maxWidth: "580px", margin: i === paras.length - 1 ? 0 : "0 0 14px" }}>
              {p}
            </p>
          ))}
          {ctas && ctas.length > 0 && (
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "32px" }}>
              {ctas.map(c => {
                const style: React.CSSProperties = c.secondary
                  ? { background: "transparent", color: ON_DARK, border: `1px solid rgba(${ON_DARK_RGB},0.5)`, textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px", padding: "13px 26px", letterSpacing: "0.04em", display: "inline-block" }
                  : { background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", padding: "13px 26px", letterSpacing: "0.04em", display: "inline-block" };
                const onClick = () => c.event && track(c.event);
                return c.href.startsWith("#")
                  ? <a key={c.label} href={c.href} onClick={onClick} style={style}>{c.label}</a>
                  : <Link key={c.label} href={c.href} onClick={onClick} style={style}>{c.label}</Link>;
              })}
            </div>
          )}
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
    <section style={{ background: OAT, padding: "clamp(56px,10vw,100px) clamp(20px,5vw,40px)", minHeight: "50vh" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ borderLeft: `4px solid ${RUST}`, paddingLeft: "28px" }}>
          <p style={{
            fontFamily: "var(--eba-heading)", fontStyle: "italic",
            fontSize: "1.25rem", lineHeight: 1.7, color: NAVY, margin: "0 0 32px",
          }}>{message}</p>
          <Link href="/contact" style={{
            background: CTA_DARK_BG, color: "#fff", textDecoration: "none",
            fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px",
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

// ── Mentorship page ─────────────────────────────────────────────────────────
// Copy per Mark's Mentorship page amendment schedule (19 Sep 2026): practical,
// high-touch support; limited numbers explained by the time mentoring takes,
// never used as the proposition. The dated month-by-month availability grid
// and waitlist form were removed because nothing drives them live.

const MENTOR_ROUTES: {
  key: string; label: string; paras: string[]; suited: string; cadence?: string; pricing: string; cta: string;
}[] = [
  {
    key: "Group Mentorship",
    label: "Group Mentorship",
    paras: [
      "Monthly small-group sessions with engineering business owners and leaders, facilitated by an experienced Academy mentor.",
      "Sessions are structured around the real commercial, operational and leadership challenges participants are dealing with, including margin, cash flow, contracts, people, systems and growth.",
      "Groups are kept small, with up to six participants, so there is time to discuss each business properly and learn from the experience of others facing similar challenges.",
    ],
    suited: "Best suited to owners and leaders who value regular challenge, shared learning and the perspective that comes from discussing business issues with other engineering-business owners.",
    pricing: "Contact us for current pricing.",
    cta: "Enquire About Group Mentorship →",
  },
  {
    key: "1:1 Mentorship",
    label: "1:1 Mentorship",
    paras: [
      "Regular 1:1 sessions with an experienced engineering business leader, focused entirely on your business, priorities and current challenges.",
      "This can include scaling the business, improving commercial or operational performance, strengthening the leadership team, restructuring, preparing for succession or exit, or working through a specific issue that requires experienced external perspective.",
      "The agenda is built around what is happening in your business rather than a fixed mentoring programme.",
    ],
    suited: "Best suited to owners and senior leaders who want regular confidential support around the decisions and challenges specific to their own business.",
    cadence: "Typically fortnightly, with the structure agreed around the needs of the business.",
    pricing: "Pricing agreed according to the mentoring structure and level of support required.",
    cta: "Enquire About 1:1 Mentorship →",
  },
  {
    key: "Founder Sessions with Mark",
    label: "Founder Sessions with Mark",
    paras: [
      "A limited number of 1:1 sessions are available directly with Mark Poulton, founder of The Engineering Business Academy and CEO of KEYIS Group.",
      "These sessions are designed for owners and senior leaders working through significant business decisions where Mark's own experience of building, growing and managing engineering businesses can provide useful perspective.",
      "Typical discussions may include growth strategy, business structure, leadership, commercial performance, building management teams, acquisitions, restructuring, succession and reducing the dependence of the business on the owner.",
      "Sessions are deliberately limited so Mark can remain actively involved in each business he works with.",
    ],
    suited: "Best suited to owners and senior leaders facing significant decisions about the structure, growth or future of the business.",
    pricing: "Pricing confirmed following an initial discussion about the support required.",
    cta: "Discuss Founder Mentorship →",
  },
];

const MENTOR_WORK_ON = [
  { title: "Commercial performance", body: "Margin, project performance, commercial controls, contracts, variations and improving visibility across the business." },
  { title: "Cash & financial control", body: "Cash flow, working capital, forecasting, financial reporting and understanding what is driving business performance." },
  { title: "Leadership & people", body: "Leadership structure, accountability, recruitment, developing managers and reducing dependence on the owner." },
  { title: "Systems & operations", body: "Processes, procedures, management information, operational structure and creating more consistent ways of working." },
  { title: "Growth & strategy", body: "Growth plans, new divisions, acquisitions, market expansion and deciding where the business should focus next." },
  { title: "Structure, succession & exit", body: "Building the leadership and organisational structure required for the next stage, including preparing the business for succession or eventual exit." },
];

const mentorEnquiry = (route?: string) =>
  route ? `/contact?enquiry=mentorship&tier=${encodeURIComponent(route)}` : "/contact?enquiry=mentorship";

export function MentorshipPage() {
  const isMobile = useIsMobile();
  const h2: React.CSSProperties = { fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "clamp(1.8rem, 3.4vw, 2.5rem)", letterSpacing: "-0.02em", color: NAVY, margin: "0 0 20px", lineHeight: 1.12 };
  const body: React.CSSProperties = { color: `rgba(${NAVY_RGB},0.75)`, fontSize: "16.5px", lineHeight: 1.75, margin: "0 0 16px" };
  const primaryBtn: React.CSSProperties = { background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", padding: "13px 26px", letterSpacing: "0.04em", display: "inline-block" };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.mentorship} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/mentorship" />
      <PlaceholderHero
        label="Mentorship"
        title="Practical mentorship for engineering business owners and leaders."
        sub={[
          "For engineering business owners and leaders who want experienced input on the decisions, challenges and opportunities they are dealing with in the business.",
          "Choose from small-group mentorship, 1:1 support with an experienced engineering business leader, or a limited number of founder sessions with Mark Poulton.",
          "The focus is practical: understanding the situation, challenging the thinking where needed and helping you make clearer decisions about what comes next.",
        ]}
        ctas={[
          { label: "Explore Mentorship Options ↓", href: "#mentorship-options", event: "cta_mentor_explore_options" },
          { label: "Talk to Us About Mentorship →", href: mentorEnquiry(), secondary: true, event: "cta_mentor_talk_hero" },
        ]}
        portrait={MARK_PHOTO_MENTORSHIP}
        portraitAlt="Mark Poulton leading a group mentorship session"
      />

      {/* ── Positioning ── */}
      <section style={{ background: WHITE, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <h2 style={h2}>Sometimes you need more than a lesson.</h2>
          <p style={body}>The Academy gives you the knowledge, systems and tools. Mentorship gives you the opportunity to apply that thinking directly to your own business.</p>
          <p style={body}>Sessions can focus on the issues that matter most at the time: margin, cash flow, contracts, people, structure, leadership, growth, operational performance, acquisitions, succession or the wider direction of the business.</p>
          <p style={{ ...body, margin: 0 }}>There is no fixed script. The value comes from discussing the real situation with someone who understands the decisions engineering business owners have to make.</p>
        </div>
      </section>

      {/* ── Mentorship options ── */}
      <section id="mentorship-options" style={{ position: "relative", overflow: "hidden", background: SECTION_TINT, backgroundImage: SECTION_GLOW, padding: isMobile ? "56px 20px" : "80px 40px", scrollMarginTop: "80px" }}>
        <AmbientOrbs />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: RUST, margin: "0 0 14px" }}>Mentorship options</p>
          <h2 style={{ ...h2, margin: "0 0 36px" }}>Three ways to work with experienced engineering business leaders.</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "20px" }}>
            {MENTOR_ROUTES.map(r => (
              <div key={r.key} style={{ background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.09)`, borderRadius: "18px", overflow: "hidden", boxShadow: "0 20px 46px -32px rgba(0,0,0,0.26)", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "28px 30px 32px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.3rem", color: NAVY, margin: "0 0 14px" }}>{r.label}</h3>
                  {r.paras.map((p, i) => (
                    <p key={i} style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "14px", lineHeight: 1.75, margin: "0 0 12px" }}>{p}</p>
                  ))}
                  {r.cadence && (
                    <p style={{ color: `rgba(${NAVY_RGB},0.7)`, fontSize: "14px", lineHeight: 1.75, margin: "0 0 12px" }}><strong style={{ color: NAVY }}>Format:</strong> {r.cadence}</p>
                  )}
                  <p style={{ color: `rgba(${NAVY_RGB},0.8)`, fontSize: "13.5px", lineHeight: 1.7, margin: "6px 0 18px", paddingLeft: "14px", borderLeft: `3px solid rgba(${RUST_RGB},0.6)` }}>{r.suited}</p>
                  <span style={{ fontFamily: "var(--eba-heading)", fontStyle: "italic", color: RUST, fontSize: "14px", display: "block", marginBottom: "20px", marginTop: "auto" }}>{r.pricing}</span>
                  <Link href={mentorEnquiry(r.key)} onClick={() => track("cta_mentor_enquire", { route: r.key })} style={{ ...primaryBtn, textAlign: "center" }}>{r.cta}</Link>
                </div>
              </div>
            ))}
          </div>

          {/* The mentor team — renders ONLY when LEADERSHIP_TEAM is populated
              (see constants.ts). No invented people, ever. */}
          {LEADERSHIP_TEAM.length > 0 && (
            <div style={{ marginTop: "48px" }}>
              <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2rem)", color: NAVY, margin: "0 0 24px" }}>
                The mentor team.
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" }}>
                {LEADERSHIP_TEAM.map(m => (
                  <div key={m.name} style={{ background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.09)`, borderRadius: "14px", overflow: "hidden" }}>
                    {m.photo && <Photo src={m.photo} alt={m.name} ratio="4 / 3" radius="0" shadow={false} />}
                    <div style={{ padding: "20px 22px" }}>
                      <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.05rem", color: NAVY, margin: "0 0 2px" }}>{m.name}</h3>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: RUST, margin: "0 0 10px" }}>{m.role}</p>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13.5px", fontWeight: 300, lineHeight: 1.6, color: `rgba(${NAVY_RGB},0.7)`, margin: 0 }}>{m.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Mark's relevant experience ── */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "56px 20px" : "84px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: RUST_ON_DARK, margin: "0 0 14px" }}>Founder sessions</p>
          <h2 style={{ ...h2, color: ON_DARK }}>Experience from inside the business.</h2>
          {[
            "Mark's mentoring is based on practical experience rather than business-coaching theory.",
            "His experience includes building and leading engineering businesses across multiple disciplines and divisions, developing senior leadership teams, expanding into new markets, managing periods of rapid growth and restructuring, and dealing with the commercial and operational pressures that come with scale.",
            "The purpose of the sessions is not to tell an owner how to run their business. It is to bring another experienced perspective to the decisions they are making.",
          ].map((p, i, arr) => (
            <p key={i} style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "16.5px", lineHeight: 1.75, margin: i === arr.length - 1 ? 0 : "0 0 16px" }}>{p}</p>
          ))}
        </div>
      </section>

      {/* ── What we can work on ── */}
      <section style={{ background: CREAM, padding: isMobile ? "56px 20px" : "84px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ ...h2, margin: "0 0 32px" }}>What we can work on together.</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "18px" }}>
            {MENTOR_WORK_ON.map(w => (
              <div key={w.title} style={{ background: WHITE, borderTop: `3px solid ${RUST}`, borderRadius: "12px", padding: "24px 24px" }}>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "15px", color: NAVY, margin: "0 0 8px" }}>{w.title}</h3>
                <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14.5px", lineHeight: 1.6, margin: 0 }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Availability ── no static month grid: nothing drives it live */}
      <section style={{ background: OAT, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr", gap: isMobile ? "32px" : "56px", alignItems: "start" }}>
          <div>
            <span style={{ display: "inline-block", background: RUST, color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 14px", marginBottom: "20px" }}>Availability</span>
            <h2 style={h2}>Mentorship availability</h2>
            <p style={body}>Mentorship numbers are kept intentionally small so each mentor has enough time to understand the businesses and people they are supporting.</p>
            <p style={{ ...body, margin: 0 }}>Availability varies depending on the mentoring format and mentor capacity.</p>
          </div>
          <div style={{ background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.09)`, borderRadius: "16px", padding: "28px 30px" }}>
            <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.2rem", color: NAVY, margin: "0 0 10px" }}>Current availability</h3>
            <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "14.5px", lineHeight: 1.7, margin: "0 0 20px" }}>
              We accept a limited number of new mentorship clients at any one time. Contact us to check current availability and discuss which format may be most appropriate for you.
            </p>
            <Link href={mentorEnquiry()} onClick={() => track("cta_mentor_check_availability")} style={primaryBtn}>Check Mentorship Availability →</Link>
          </div>
        </div>
      </section>

      {/* ── Principle ── */}
      <section style={{ background: WHITE, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <h2 style={h2}>Your business. Your decisions.</h2>
          <p style={body}>Mentorship is there to challenge thinking, share experience and help you see the situation more clearly.</p>
          <p style={{ ...body, margin: 0 }}>The decisions remain yours. Good mentorship should help you make those decisions with better information, stronger perspective and greater confidence in the reasoning behind them.</p>
        </div>
      </section>

      {/* ── Start a conversation ── replaces the old waitlist form */}
      <section style={{ background: DARK_GRADIENT, padding: isMobile ? "56px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <h2 style={{ ...h2, color: ON_DARK }}>Talk to us about mentorship.</h2>
          <p style={{ color: `rgba(${CREAM_RGB},0.78)`, fontSize: "16.5px", lineHeight: 1.75, margin: "0 0 28px" }}>
            Tell us a little about your business, where you are now and the areas you would like support with. We can then recommend the most appropriate mentoring format and confirm current availability.
          </p>
          <Link href={mentorEnquiry()} onClick={() => track("cta_mentor_start_conversation")} style={primaryBtn}>Start a Mentorship Conversation →</Link>
        </div>
      </section>

      <CtaBanner
        title="Not sure which option is right for you?"
        sub="Tell us a little about your business, what you are trying to improve and the support you are looking for. We can help you decide whether the Academy, Document Library, AI Tools or Mentorship is the most appropriate place to start."
        cta="Talk to Us"
        href="/contact"
        eventName="cta_banner_mentorship"
      />
      <PlaceholderFooter />
    </div>
  );
}

// Tier wording matches the Academy page (Mark's schedule, 19 Sep 2026): no
// founding-cohort or "rises to" language anywhere.
const PRICING_TIERS = [
  {
    name: "The Academy",
    tag: "The full curriculum, for life.",
    popular: false,
    price: PRICING.academyFounding,
    features: [
      "Full 100+ lesson curriculum across 10 modules",
      "Toolbox Talk Generator included",
      "Lifetime access",
      "Future curriculum updates included",
    ],
  },
  {
    name: "Academy + Documents",
    tag: "The curriculum plus the complete document library.",
    popular: true,
    price: PRICING.academyDocsFounding,
    features: [
      "Everything in The Academy",
      "Full 380-document library in editable Word and PDF formats",
      "Future document additions included",
    ],
  },
];
// Mentorship remains application-only via /mentorship. Prices read from
// PRICING in constants.ts (confirmed).

export function PricingPage() {
  const border = `rgba(${NAVY_RGB},0.10)`;
  const sub = `rgba(${NAVY_RGB},0.62)`;
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.pricing} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/pricing" />
      <PlaceholderHero
        label="Academy Pricing"
        title="Straightforward access to practical business learning built for engineering businesses."
        sub="Choose the Academy on its own or combine it with the document library for a broader set of practical resources you can use inside the business."
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
                  <span style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 16px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                    Most popular
                  </span>
                )}
                <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.01em", color: NAVY, margin: "0 0 6px" }}>{tier.name}</h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: sub, margin: "0 0 22px", lineHeight: 1.5 }}>{tier.tag}</p>
                <div style={{ marginBottom: "22px" }}>
                  {/* Pricing gated behind enquiry (Mark-approved, 1 Sep 2026) — the
                      number itself no longer appears on the page. Watch the free
                      lesson, ask, then we tell you. Do not reintroduce tier.price /
                      tier.rises here without checking with Mark first. */}
                  <div style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.5rem", color: NAVY, lineHeight: 1.2 }}>
                    One-time payment
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", color: RUST, fontWeight: 600, marginTop: "4px" }}>
                    Lifetime access · price confirmed when you enquire
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "11px", marginBottom: "28px" }}>
                  {tier.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: `rgba(${RUST_RGB},0.12)`, color: RUST, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "11px", fontWeight: 800, marginTop: "1px" }}>✓</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: `rgba(${NAVY_RGB},0.75)`, lineHeight: 1.45 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/contact?enquiry=pricing&tier=${encodeURIComponent(tier.name)}`} onClick={() => track("pricing_enquiry_click", { tier: tier.name })} style={{
                  marginTop: "auto", textAlign: "center",
                  background: tier.popular ? CTA_PRIMARY_BG : "transparent",
                  color: tier.popular ? "#fff" : NAVY,
                  border: tier.popular ? "none" : `1px solid rgba(${NAVY_RGB},0.25)`,
                  textDecoration: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px",
                  padding: "13px 24px", letterSpacing: "0.03em", display: "block",
                }}>
                  Enquire about pricing →
                </Link>
              </div>
            ))}
          </div>

          {/* ── AI TOOLS PRICING ── tools accent (sky/cobalt); every value pulls
              from PRICING in constants.ts and stays gated until confirmed. */}
          <div style={{ marginTop: "56px" }}>
            <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "clamp(1.5rem, 2.6vw, 2rem)", letterSpacing: "-0.01em", color: NAVY, margin: "0 0 6px" }}>
              AI tools — priced separately.
            </h2>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14.5px", color: `rgba(${NAVY_RGB},0.65)`, margin: "0 0 24px", maxWidth: "560px", lineHeight: 1.6 }}>
              RAMS and COSHH are monthly subscriptions. The O&M service is compiled for you, per manual. The Compliance Co-Pilot is configured around your business and priced per deployment. None are included in Academy membership, though every Academy enrolment includes the full Toolbox Talk Generator, and a free version lives on the AI Tools page.
            </p>
            <div style={{ background: WHITE, border: `1px solid rgba(${NAVY_RGB},0.10)`, borderTop: `3px solid ${COBALT}`, borderRadius: "12px", overflow: "hidden" }}>
              {[
                { name: "RAMS Generator", detail: "Monthly subscription. Structured RAMS drafts for competent review.", value: PRICING.ramsMonthly, checkout: TOOL_CHECKOUT.rams, key: "rams" },
                { name: "COSHH Generator", detail: "Monthly subscription. Structured COSHH assessment drafts for competent review.", value: PRICING.coshhMonthly, checkout: TOOL_CHECKOUT.coshh, key: "coshh" },
                { name: "RAMS + COSHH bundle", detail: "Both tools under one monthly subscription.", value: PRICING.toolsBothMonthly, checkout: TOOL_CHECKOUT.bundle, key: "bundle" },
                { name: "O&M manual service", detail: "Compiled for you, per manual. Returned for your review within 24 hours.", value: PRICING.omPerManual, checkout: undefined, key: "om" },
                { name: "Compliance Co-Pilot", detail: "Configured around your own documents, hosted and supported. Includes setup, hosting and ongoing support.", value: `${PRICING.coPilotSetup} setup + ${PRICING.coPilotMonthly}`, checkout: undefined, key: "copilot" },
              ].map(({ name, detail, value, checkout, key }, i) => (
                <div key={name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap",
                  padding: "18px 24px", borderTop: i > 0 ? `1px solid rgba(${NAVY_RGB},0.08)` : "none",
                }}>
                  <div style={{ minWidth: "220px" }}>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "15px", color: NAVY, margin: "0 0 2px" }}>{name}</p>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: `rgba(${NAVY_RGB},0.6)`, margin: 0, lineHeight: 1.5 }}>{detail}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "14px", color: COBALT, background: `rgba(${COBALT_RGB},0.10)`, padding: "6px 14px", borderRadius: "8px", whiteSpace: "nowrap" }}>
                      {isPlaceholder(value) ? "Pricing announced soon" : value}
                    </span>
                    {/* Kajabi checkout for the subscriptions only; hidden while OFFERS_LIVE is false. */}
                    {checkout && (
                      <a href={checkout} target="_blank" rel="noopener noreferrer"
                        onClick={() => track("cta_tool_subscribe", { tool: key })}
                        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "13.5px", color: "#fff", background: CTA_PRIMARY_BG, padding: "8px 16px", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap" }}>
                        Subscribe →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reassurance strip */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 28px", marginTop: "40px" }}>
            {[
              "Lifetime access to the Academy",
              "14-day money-back guarantee",
              "Built for engineering and technical services businesses",
            ].map(t => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "'Poppins', sans-serif", fontSize: "13.5px", fontWeight: 600, color: `rgba(${NAVY_RGB},0.7)` }}>
                <span style={{ color: RUST, fontWeight: 800 }}>✓</span> {t}
              </span>
            ))}
          </div>
          <p style={{ textAlign: "center", fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: sub, maxWidth: "620px", margin: "28px auto 0", lineHeight: 1.6 }}>
            The AI tools are priced separately and are not included in Academy membership. Mentorship is arranged separately, with pricing agreed after an initial conversation.
          </p>
        </div>
      </section>

      {/* ── SECTION BREAKER ── */}
      <SectionBreaker
        kicker="Questions about pricing"
        title="Not sure which level fits?"
        accent="Talk to us."
        variant="gradient"
      />

      <SiteFooter />
    </div>
  );
}

export function EnterprisePage() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.enterprise} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/enterprise" />
      <PlaceholderHero
        label="Enterprise"
        title="Deploy EBA across your entire organisation."
        sub="For engineering services groups, principal contractors, and training providers who want to deploy the Academy curriculum and AI tools at scale. White-label licensing, group access, and managed implementation available."
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
      a: "Owners and leaders of engineering and technical services businesses who want stronger commercial control, better systems, stronger teams and a business that is ready for its next stage of growth. Mechanical and electrical, HVAC, fire and security, power, facilities, controls, renewables, data and specialist engineering services are all covered by the same principles.",
    },
    {
      q: "Do I need any prior business knowledge?",
      a: "No. The Academy starts from first principles and builds systematically. The only prerequisite is that you are running, leading or about to run an engineering or technical services business.",
    },
    {
      q: "How long does the programme take?",
      a: "The Academy contains 100+ lessons across 10 modules and is self-paced. As a guide, working through the full curriculum over three to six months alongside the business is realistic, and you can return to individual lessons whenever they become relevant. There is no deadline.",
    },
    {
      q: "Is this just video content?",
      a: "No. The Academy combines structured video lessons with downloadable frameworks and templates you can put to work in the business. The Academy + Documents option adds the full 380-document library. Mentorship and the AI tools are available separately.",
    },
    {
      q: "What does Academy membership include?",
      a: "Lifetime access to 100+ lessons across 10 modules, the Toolbox Talk Generator, and future updates to the curriculum. Academy + Documents adds the 380-document library. AI tools and mentorship are priced separately.",
    },
    {
      q: "Can I access the AI tools without joining the Academy?",
      a: "Yes. RAMS and COSHH are available on a monthly subscription, the O&M manual service is compiled for you per manual, and the Compliance Co-Pilot is built for your business and priced per deployment — none are included with Academy membership. The exception is the full Toolbox Talk Generator, which is included with every Academy enrolment: your access link is provided once payment is complete. There's also a free basic version on the AI Tools page.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a 14-day refund on all Academy memberships, no questions asked. If the programme is not right for you, contact us within 14 days of purchase.",
    },
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.faq} />
      <MobileNav transparent={false} />
      <PlaceholderNav active="/faq" />
      <PlaceholderHero
        label="FAQ"
        title="Frequently asked questions."
        sub="If you have a question that isn't answered here, use the contact form and we'll respond within one business day."
      />
      <section style={{ backgroundColor: IS_VIVID ? CREAM : OAT, backgroundImage: SECTION_GLOW, padding: "clamp(48px,9vw,80px) clamp(20px,5vw,40px)" }}>
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
      <section style={{ background: DARK_GRADIENT, padding: "clamp(44px,8vw,64px) clamp(20px,5vw,40px)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.8rem", color: ON_DARK, margin: "0 0 16px" }}>
            Still have questions?
          </h3>
          <p style={{ color: `rgba(${CREAM_RGB},0.7)`, fontSize: "15px", lineHeight: 1.65, margin: "0 0 28px" }}>
            Use the contact form and we'll respond within one business day.
          </p>
          <Link href="/contact" style={{
            background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
            fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "13px",
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
