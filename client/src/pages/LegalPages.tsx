/**
 * EBA Legal Pages — Privacy Policy, Terms & Conditions
 * Design: Warm Editorial Authority
 * Palette: Cream #EEE9DF | Navy #1B2632 | Rust #A35139 | Oat #DDD6C8
 */

import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useIsMobile } from "@/hooks/useMobile";
import { useState, useEffect } from "react";
import {
  ENROL_HREF,
  ENROL_READY,
  ENROL_PENDING_LABEL,
  COMPANY_REG,
  RUST,
  NAVY,
  CREAM,
  OAT,
  isPlaceholder,
  DARK_GRADIENT, RUST_RGB, NAVY_RGB, CREAM_RGB,
  IS_VIVID, ON_DARK, ON_DARK_RGB, CTA_DARK_BG, CTA_PRIMARY_BG, NAV_RGB, HERO_GLOW,
  NAV_BAR_BG, NAV_LINK, NAV_LINK_ACTIVE, NAV_BORDER, NAV_CTA_BG, NAV_CTA_TEXT,
} from "@/lib/constants";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { track } from "@/lib/track";

function LegalNav({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav className="eba-desktop-nav" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: NAV_BAR_BG,
      borderBottom: `1px solid ${NAV_BORDER}`,
      boxShadow: scrolled ? "0 12px 30px -18px rgba(0,0,0,0.5)" : "none",
      transition: "box-shadow 0.3s ease", padding: "0 40px",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <EBALogo height={38} light navOnCobalt />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {[
            { label: "Academy", href: "/academy" },
            { label: "AI Tools", href: "/ai-tools" },
            { label: "Documents", href: "/documents" },
            { label: "Mentorship", href: "/mentorship" },
            { label: "Our Story", href: "/our-story" },
            { label: "Contact", href: "/contact" },
          ].map(({ label, href }) => (
            <Link key={href} href={href} style={{
              color: href === active ? NAV_LINK_ACTIVE : NAV_LINK,
              textDecoration: "none", fontFamily: "'Roboto', sans-serif",
              fontWeight: href === active ? 600 : 500, fontSize: "14px",
            }}>
              {label}
            </Link>
          ))}
          <span>
            <a href={ENROL_HREF} target="_blank" rel="noopener noreferrer" aria-disabled={!ENROL_READY || undefined} onClick={() => track("cta_join_cohort_nav")} style={{
              background: NAV_CTA_BG, color: NAV_CTA_TEXT, textDecoration: "none",
              fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "13px",
              padding: "9px 20px", letterSpacing: "0.04em", display: "inline-block", borderRadius: "10px",
            }}>
              {ENROL_READY ? "Join the Academy →" : ENROL_PENDING_LABEL}
            </a>
          </span>
        </div>
      </div>
    </nav>
  );
}

function LegalFooter() {
  const isMobile = useIsMobile();
  return (
    <SiteFooter />
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{
        fontFamily: "var(--eba-heading)", fontWeight: 700,
        fontSize: "1.3rem", color: NAVY, margin: "0 0 16px",
        paddingBottom: "10px", borderBottom: `1px solid rgba(${NAVY_RGB},0.1)`,
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

const bodyText: React.CSSProperties = {
  color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", lineHeight: 1.8, margin: "0 0 16px",
  fontFamily: "'Roboto', sans-serif",
};

// ─────────────────────────────────────────────
// PRIVACY POLICY PAGE
// ─────────────────────────────────────────────

export function PrivacyPolicyPage() {
  const isMobile = useIsMobile();
  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.privacy} />
      <MobileNav transparent={false} />
      <LegalNav active="/privacy-policy" />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "60px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <p style={{ color: RUST, fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>
            Legal
          </p>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 16px", lineHeight: 1.05,
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "14px", margin: 0 }}>
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>

          <LegalSection title="1. Who we are">
            <p style={bodyText}>
              The Engineering Business Academy ("EBA", "we", "us", "our") is operated by The Engineering Business Academy Ltd. Company registration number: {isPlaceholder(COMPANY_REG) ? "[to be confirmed]" : COMPANY_REG}. Registered in England and Wales.
            </p>
            <p style={bodyText}>
              We are the data controller for the personal data you provide to us when using this website and our services. If you have any questions about this policy, please contact us at <a href="mailto:hello@eba.academy" style={{ color: RUST }}>hello@eba.academy</a>.
            </p>
          </LegalSection>

          <LegalSection title="2. What data we collect">
            <p style={bodyText}>We may collect the following types of personal data:</p>
            <ul style={{ ...bodyText, paddingLeft: "24px", margin: "0 0 16px" }}>
              <li style={{ marginBottom: "8px" }}><strong>Identity data:</strong> your name and job title</li>
              <li style={{ marginBottom: "8px" }}><strong>Contact data:</strong> your email address, phone number, and company name</li>
              <li style={{ marginBottom: "8px" }}><strong>Transaction data:</strong> details of products and services you have purchased from us, processed via our Kajabi platform</li>
              <li style={{ marginBottom: "8px" }}><strong>Technical data:</strong> IP address, browser type and version, time zone, browser plug-in types, operating system and platform, and other technology on the devices you use to access this website</li>
              <li style={{ marginBottom: "8px" }}><strong>Usage data:</strong> information about how you use our website and services</li>
              <li style={{ marginBottom: "8px" }}><strong>Marketing data:</strong> your preferences in receiving marketing from us</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. How we collect your data">
            <p style={bodyText}>We collect data through:</p>
            <ul style={{ ...bodyText, paddingLeft: "24px", margin: "0 0 16px" }}>
              <li style={{ marginBottom: "8px" }}>Direct interactions — when you complete a contact form, register your interest, or enrol in the Academy</li>
              <li style={{ marginBottom: "8px" }}>Automated technologies — cookies and similar tracking technologies when you visit our website (see Section 7)</li>
              {/* TODO(eba): confirm privacy policy mentions analytics with your DPO/legal. */}
              <li style={{ marginBottom: "8px" }}>Privacy-first, cookieless analytics — we use Vercel Analytics and Plausible to measure aggregate website usage and traffic sources. These set no cookies and collect no personally identifiable information</li>
              <li style={{ marginBottom: "8px" }}>Third parties — our course platform (Kajabi) when you purchase or access our programmes</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. How we use your data">
            <p style={bodyText}>We use your personal data for the following purposes:</p>
            <ul style={{ ...bodyText, paddingLeft: "24px", margin: "0 0 16px" }}>
              <li style={{ marginBottom: "8px" }}>To process your enrolment and deliver the Academy programme</li>
              <li style={{ marginBottom: "8px" }}>To respond to your enquiries and provide customer support</li>
              <li style={{ marginBottom: "8px" }}>To send you information about your purchase and related services</li>
              <li style={{ marginBottom: "8px" }}>To send you marketing communications where you have consented or where we have a legitimate interest</li>
              <li style={{ marginBottom: "8px" }}>To improve our website and services</li>
              <li style={{ marginBottom: "8px" }}>To comply with our legal obligations</li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Legal basis for processing">
            <p style={bodyText}>We process your personal data on the following legal bases under UK GDPR:</p>
            <ul style={{ ...bodyText, paddingLeft: "24px", margin: "0 0 16px" }}>
              <li style={{ marginBottom: "8px" }}><strong>Contract:</strong> where processing is necessary to fulfil a contract with you (e.g., delivering the Academy programme)</li>
              <li style={{ marginBottom: "8px" }}><strong>Legitimate interests:</strong> where we have a legitimate business interest in processing your data (e.g., improving our services, direct marketing to existing customers)</li>
              <li style={{ marginBottom: "8px" }}><strong>Consent:</strong> where you have given us explicit consent (e.g., subscribing to marketing emails)</li>
              <li style={{ marginBottom: "8px" }}><strong>Legal obligation:</strong> where processing is necessary to comply with a legal obligation</li>
            </ul>
          </LegalSection>

          <LegalSection title="6. Data sharing">
            <p style={bodyText}>
              We do not sell your personal data. We may share your data with trusted third-party service providers who assist us in operating our business, including:
            </p>
            <ul style={{ ...bodyText, paddingLeft: "24px", margin: "0 0 16px" }}>
              <li style={{ marginBottom: "8px" }}>Kajabi (course platform and payment processing)</li>
              <li style={{ marginBottom: "8px" }}>Email marketing platforms</li>
              <li style={{ marginBottom: "8px" }}>Analytics providers</li>
            </ul>
            <p style={bodyText}>
              All third-party processors are required to process your data in accordance with UK GDPR and our instructions.
            </p>
          </LegalSection>

          <LegalSection title="7. Cookies">
            <p style={bodyText}>
              Our website uses cookies to improve your browsing experience and to analyse website traffic. A cookie is a small text file placed on your device by a website.
            </p>
            <p style={bodyText}>
              We use the following types of cookies:
            </p>
            <ul style={{ ...bodyText, paddingLeft: "24px", margin: "0 0 16px" }}>
              <li style={{ marginBottom: "8px" }}><strong>Strictly necessary cookies:</strong> required for the website to function. These cannot be disabled.</li>
              <li style={{ marginBottom: "8px" }}><strong>Analytics cookies:</strong> help us understand how visitors interact with our website. We use this information to improve our site. These are only set with your consent.</li>
              <li style={{ marginBottom: "8px" }}><strong>Marketing cookies:</strong> used to track visitors across websites to display relevant advertising. These are only set with your consent.</li>
            </ul>
            <p style={bodyText}>
              You can manage your cookie preferences at any time using the cookie consent banner on this website, or by adjusting your browser settings.
            </p>
          </LegalSection>

          <LegalSection title="8. Data retention">
            <p style={bodyText}>
              We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including satisfying any legal, accounting, or reporting requirements. For Academy members, we retain data for the duration of your membership plus 7 years.
            </p>
          </LegalSection>

          <LegalSection title="9. Your rights">
            <p style={bodyText}>Under UK GDPR, you have the following rights:</p>
            <ul style={{ ...bodyText, paddingLeft: "24px", margin: "0 0 16px" }}>
              <li style={{ marginBottom: "8px" }}>The right to access your personal data</li>
              <li style={{ marginBottom: "8px" }}>The right to rectification of inaccurate data</li>
              <li style={{ marginBottom: "8px" }}>The right to erasure ("right to be forgotten")</li>
              <li style={{ marginBottom: "8px" }}>The right to restrict processing</li>
              <li style={{ marginBottom: "8px" }}>The right to data portability</li>
              <li style={{ marginBottom: "8px" }}>The right to object to processing</li>
              <li style={{ marginBottom: "8px" }}>Rights relating to automated decision-making and profiling</li>
            </ul>
            <p style={bodyText}>
              To exercise any of these rights, please contact us at <a href="mailto:hello@eba.academy" style={{ color: RUST }}>hello@eba.academy</a>. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: RUST }}>ico.org.uk</a>.
            </p>
          </LegalSection>

          <LegalSection title="10. Changes to this policy">
            <p style={bodyText}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or by email. The date at the top of this policy indicates when it was last updated.
            </p>
          </LegalSection>

          <div style={{ background: OAT, padding: "24px 28px", borderLeft: `3px solid ${RUST}`, marginTop: "40px" }}>
            <p style={{ ...bodyText, margin: 0 }}>
              <strong>Contact us:</strong> The Engineering Business Academy Ltd · <a href="mailto:hello@eba.academy" style={{ color: RUST }}>hello@eba.academy</a>
            </p>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>
  );
}

// ─────────────────────────────────────────────
// TERMS & CONDITIONS PAGE
// ─────────────────────────────────────────────

export function TermsPage() {
  const isMobile = useIsMobile();
  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.terms} />
      <MobileNav transparent={false} />
      <LegalNav active="/terms" />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "90px" : "120px", paddingBottom: "60px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <p style={{ color: RUST, fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>
            Legal
          </p>
          <h1 style={{
            fontFamily: "var(--eba-heading)", fontWeight: 900,
            fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em",
            color: ON_DARK, margin: "0 0 16px", lineHeight: 1.05,
          }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ color: `rgba(${CREAM_RGB},0.72)`, fontSize: "14px", margin: 0 }}>
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: CREAM, padding: isMobile ? "60px 20px" : "80px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>

          <LegalSection title="1. About these terms">
            <p style={bodyText}>
              These Terms and Conditions ("Terms") govern your use of the website at eba.academy and any products or services offered by The Engineering Business Academy Ltd ("EBA", "we", "us", "our"), Company Reg: {isPlaceholder(COMPANY_REG) ? "[to be confirmed]" : COMPANY_REG}, registered in England and Wales.
            </p>
            <p style={bodyText}>
              By accessing our website or purchasing our products, you agree to be bound by these Terms. Please read them carefully. If you do not agree, you must not use our website or services.
            </p>
          </LegalSection>

          <LegalSection title="2. The Academy programme">
            <p style={bodyText}>
              The Engineering Business Academy is an online business education programme delivered via the Kajabi platform. Upon purchase, you will receive access to the programme content as described at the time of purchase.
            </p>
            <p style={bodyText}>
              <strong>Founding cohort pricing:</strong> Founding cohort prices are offered for a limited time and to a limited number of members. Once the founding cohort closes, these prices will not be offered again. Founding members receive lifetime access at the founding price.
            </p>
            <p style={bodyText}>
              <strong>Access:</strong> Access to the Academy is personal and non-transferable. You may not share your login credentials with any other person.
            </p>
          </LegalSection>

          <LegalSection title="3. Payment and pricing">
            <p style={bodyText}>
              All prices are displayed in British Pounds Sterling (GBP) and are inclusive of VAT where applicable. Payment is processed securely via Kajabi's payment infrastructure.
            </p>
            <p style={bodyText}>
              We reserve the right to change our prices at any time. Any price changes will not affect purchases already made.
            </p>
          </LegalSection>

          <LegalSection title="4. Refund policy">
            <p style={bodyText}>
              We offer a <strong>14-day money-back guarantee</strong> on all Academy memberships. If you are not satisfied with the programme for any reason, contact us within 14 days of your purchase date and we will issue a full refund, no questions asked.
            </p>
            <p style={bodyText}>
              Refund requests received after 14 days of purchase will be considered at our discretion. Document library purchases are non-refundable once the documents have been downloaded.
            </p>
          </LegalSection>

          <LegalSection title="5. Intellectual property">
            <p style={bodyText}>
              All content on this website and within the Academy programme — including text, video, audio, graphics, templates, and documents — is the intellectual property of The Engineering Business Academy Ltd and is protected by copyright law.
            </p>
            <p style={bodyText}>
              You may use the content for your own personal and business purposes. You may not reproduce, distribute, sell, or create derivative works from our content without our prior written consent.
            </p>
          </LegalSection>

          <LegalSection title="6. Document library">
            <p style={bodyText}>
              Documents purchased from the EBA document library are licensed for use within your business. You may adapt them for your own use. You may not resell, redistribute, or sublicense the documents to third parties.
            </p>
          </LegalSection>

          <LegalSection title="7. AI tools">
            <p style={bodyText}>
              Our AI tools (including the O&M Manual Compiler and Compliance Co-Pilot) are provided as productivity aids. The output of these tools should be reviewed by a competent person before use. EBA does not accept liability for any errors or omissions in AI-generated content.
            </p>
            <p style={bodyText}>
              Subscriptions to AI tools are billed monthly and may be cancelled at any time. Cancellation takes effect at the end of the current billing period.
            </p>
          </LegalSection>

          <LegalSection title="8. Limitation of liability">
            <p style={bodyText}>
              The information and content provided in the Academy programme is for educational purposes only. It does not constitute legal, financial, or professional advice. You should seek independent professional advice before making any business decisions.
            </p>
            <p style={bodyText}>
              To the fullest extent permitted by law, EBA's total liability to you in connection with these Terms shall not exceed the amount you paid for the relevant product or service.
            </p>
          </LegalSection>

          <LegalSection title="9. Governing law">
            <p style={bodyText}>
              These Terms are governed by the laws of England and Wales. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </LegalSection>

          <LegalSection title="10. Changes to these terms">
            <p style={bodyText}>
              We may update these Terms from time to time. We will notify you of significant changes by posting a notice on our website. Your continued use of our services after any changes constitutes your acceptance of the updated Terms.
            </p>
          </LegalSection>

          <div style={{ background: OAT, padding: "24px 28px", borderLeft: `3px solid ${RUST}`, marginTop: "40px" }}>
            <p style={{ ...bodyText, margin: 0 }}>
              <strong>Contact us:</strong> The Engineering Business Academy Ltd · <a href="mailto:hello@eba.academy" style={{ color: RUST }}>hello@eba.academy</a>
            </p>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>
  );
}

// ─────────────────────────────────────────────
// COOKIE CONSENT BANNER
// ─────────────────────────────────────────────

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Guarded for prerender + private modes where storage throws.
    let consent: string | null = null;
    try { consent = window.localStorage.getItem("eba-cookie-consent"); } catch { /* ignore */ }
    if (!consent) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    try { window.localStorage.setItem("eba-cookie-consent", "accepted"); } catch { /* ignore */ }
    setAccepted(true);
    setTimeout(() => setVisible(false), 300);
  };

  const handleDecline = () => {
    try { window.localStorage.setItem("eba-cookie-consent", "declined"); } catch { /* ignore */ }
    setAccepted(true);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: DARK_GRADIENT, borderTop: `3px solid ${RUST}`,
      padding: "12px 24px",
      opacity: accepted ? 0 : 1,
      transform: accepted ? "translateY(8px)" : "translateY(0)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    }}>
      {/* Slim single-row bar: concise notice left, actions right; wraps on narrow screens. */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
        <p style={{
          flex: "1 1 320px", minWidth: 0,
          color: `rgba(${CREAM_RGB},0.8)`, fontFamily: "'Roboto', sans-serif",
          fontSize: "13px", lineHeight: 1.5, margin: 0,
        }}>
          <strong style={{ color: ON_DARK, fontWeight: 600 }}>This website uses cookies</strong> — strictly necessary plus optional analytics (no advertising cookies).{" "}
          <Link href="/privacy-policy" style={{ color: RUST, textDecoration: "none" }}>
            Privacy Policy
          </Link>.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flexShrink: 0 }}>
          <button
            onClick={handleAccept}
            style={{
              background: CTA_PRIMARY_BG, color: "#fff", border: "none", cursor: "pointer",
              fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: "13px",
              padding: "10px 24px", letterSpacing: "0.04em",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Accept all cookies
          </button>
          <button
            onClick={handleDecline}
            style={{
              background: "transparent", color: `rgba(${CREAM_RGB},0.7)`,
              border: `1px solid rgba(${CREAM_RGB},0.3)`, cursor: "pointer",
              fontFamily: "'Roboto', sans-serif", fontWeight: 500, fontSize: "13px",
              padding: "10px 24px",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${CREAM_RGB},0.6)`; e.currentTarget.style.color = ON_DARK; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${CREAM_RGB},0.3)`; e.currentTarget.style.color = `rgba(${CREAM_RGB},0.7)`; }}
          >
            Necessary cookies only
          </button>
        </div>
      </div>
    </div>
  );
}
