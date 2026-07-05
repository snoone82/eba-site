/**
 * 404 — branded not-found page. Links back to the homepage and the Academy.
 */
import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { Seo } from "@/components/Seo";
import {
  DARK_GRADIENT, ON_DARK, RUST_ON_DARK, CTA_PRIMARY_BG, CTA_PRIMARY_TEXT,
} from "@/lib/constants";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center",
      background: DARK_GRADIENT, color: ON_DARK,
      fontFamily: "'Poppins', sans-serif", padding: "40px 20px",
    }}>
      <Seo title="404 — Page not found · The Engineering Business Academy" description="The page you're looking for doesn't exist." path="/404" noIndex />
      <Link href="/" style={{ textDecoration: "none", marginBottom: "40px", display: "inline-flex" }}>
        <EBALogo height={52} light />
      </Link>
      <p style={{ color: RUST_ON_DARK, fontWeight: 700, fontSize: "13px", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 12px" }}>
        404 — Page not found
      </p>
      <h1 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", lineHeight: 1.15, letterSpacing: "-0.015em", margin: "0 0 14px", maxWidth: "20ch" }}>
        This page doesn't exist. The business programme does.
      </h1>
      <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "16px", fontWeight: 300, lineHeight: 1.6, maxWidth: "420px", margin: "0 0 32px" }}>
        The address may have been mistyped, or the page has moved.
      </p>
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{
          background: CTA_PRIMARY_BG, color: CTA_PRIMARY_TEXT, textDecoration: "none",
          fontWeight: 700, fontSize: "14.5px", padding: "13px 30px", borderRadius: "6px", letterSpacing: "0.03em",
        }}>
          Back to the homepage →
        </Link>
        <Link href="/academy" style={{
          background: "transparent", color: "#fff", textDecoration: "none",
          fontWeight: 600, fontSize: "14.5px", padding: "13px 30px", borderRadius: "6px",
          border: "1.5px solid rgba(255,255,255,0.55)", letterSpacing: "0.03em",
        }}>
          See the Academy
        </Link>
      </div>
    </div>
  );
}
