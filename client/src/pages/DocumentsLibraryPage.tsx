/**
 * /documents-library — the members' Document Library, SUBSCRIBER-ONLY.
 *
 * Access model matches MemberGeneratorPage/api/lib/memberToolHandler.ts:
 *  - ?access=<token> from the buyer's welcome email. No login, no password.
 *  - No token → an honest "subscriber tool" explainer with the route to buy.
 *  - 401 → link invalid/revoked. 403 → valid link, wrong product (e.g. a
 *    RAMS-only link here).
 *  - Checked once on load via /api/documents-access, then again per download
 *    by /api/doc-dl-<category> — a link that stops being entitled mid-visit
 *    (refund processed while they're browsing) still can't pull a file.
 *
 * The 380 documents are grouped by category (matches the real OneDrive folder
 * structure: Procedures + the 9 template folders) with a live search box.
 * Catalogue is static — see client/src/data/documentCatalogue.ts.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { EBALogo } from "@/components/EBALogo";
import { MobileNav } from "@/components/MobileNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Seo, PAGE_SEO } from "@/components/Seo";
import { useIsMobile } from "@/hooks/useMobile";
import { track } from "@/lib/track";
import { CATEGORY_ORDER, DOCUMENT_CATALOGUE, type DocumentEntry } from "@/data/documentCatalogue";
import {
  NAVY, NAVY_RGB, CREAM, CREAM_RGB, WHITE, OAT,
  DARK_GRADIENT, ON_DARK, HERO_GLOW, IS_VIVID,
  COBALT, COBALT_RGB, COBALT_ON_DARK,
} from "@/lib/constants";

type GateState = "checking" | "no-token" | "invalid" | "wrong-product" | "ready" | "error";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsLibraryPage() {
  const isMobile = useIsMobile();

  const [token, setToken] = useState<string | undefined>(undefined);
  const [gate, setGate] = useState<GateState>("checking");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    let access: string | undefined;
    try {
      access = new URLSearchParams(window.location.search).get("access") || undefined;
    } catch {
      /* no query string — public visitor */
    }
    setToken(access);

    if (!access) {
      setGate("no-token");
      return;
    }

    let cancelled = false;
    fetch(`/api/documents-access?access=${encodeURIComponent(access)}`)
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (cancelled) return;
        if (status === 200 && data.valid) setGate("ready");
        else if (status === 403) setGate("wrong-product");
        else if (status === 401) setGate("invalid");
        else setGate("error");
      })
      .catch(() => {
        if (!cancelled) setGate("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOCUMENT_CATALOGUE.filter((d) => {
      if (activeCategory && d.categorySlug !== activeCategory) return false;
      if (!q) return true;
      return d.title.toLowerCase().includes(q) || d.categoryLabel.toLowerCase().includes(q);
    });
  }, [query, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, DocumentEntry[]>();
    for (const d of filtered) {
      const arr = map.get(d.categorySlug) ?? [];
      arr.push(d);
      map.set(d.categorySlug, arr);
    }
    return CATEGORY_ORDER.filter((c) => map.has(c.slug)).map((c) => ({
      ...c,
      docs: (map.get(c.slug) ?? []).sort((a, b) => a.title.localeCompare(b.title)),
    }));
  }, [filtered]);

  const downloadUrl = (d: DocumentEntry) =>
    `/api/doc-dl-${d.categorySlug}?access=${encodeURIComponent(token ?? "")}&file=${encodeURIComponent(d.relWithinCat)}`;

  const panel: React.CSSProperties = {
    background: WHITE,
    border: `1px solid rgba(${NAVY_RGB},0.1)`,
    borderRadius: "14px",
    padding: isMobile ? "24px 20px" : "32px 34px",
    boxShadow: "0 24px 50px -30px rgba(0,0,0,0.25)",
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: CREAM, color: NAVY, overflowX: "hidden" }}>
      <Seo {...PAGE_SEO.documentsLibrary} noIndex />
      <MobileNav transparent={false} />

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: isMobile ? "96px" : "130px", paddingBottom: isMobile ? "32px" : "48px", background: DARK_GRADIENT }}>
        {IS_VIVID && <div className="eba-aurora" style={{ position: "absolute", inset: 0, background: HERO_GLOW, pointerEvents: "none" }} />}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1080px", margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: "28px" }}>
            <EBALogo height={40} light />
          </Link>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: COBALT_ON_DARK, margin: "0 0 14px" }}>
            Document Library · Subscriber area
          </p>
          <h1 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: isMobile ? "1.9rem" : "2.6rem", letterSpacing: "-0.025em", color: ON_DARK, margin: "0 0 14px", lineHeight: 1.08, textWrap: "balance" }}>
            Your 380 documents, organised and searchable.
          </h1>
          <p style={{ color: `rgba(${CREAM_RGB},0.75)`, fontSize: isMobile ? "15px" : "16.5px", lineHeight: 1.7, margin: 0, maxWidth: "62ch" }}>
            Procedures plus the full template library — search by name, browse by category, download what you need.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section style={{ padding: isMobile ? "32px 20px 64px" : "48px 40px 90px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          {gate === "checking" ? null : gate === "no-token" ? (
            <div style={panel}>
              <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 800, fontSize: "1.35rem", margin: "0 0 12px" }}>
                This is a subscriber area.
              </h2>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", lineHeight: 1.7, margin: "0 0 10px", maxWidth: "62ch" }}>
                Buyers get a personal access link by email — no login, no password. Open that
                link and this page unlocks; bookmark it and it works every time.
              </p>
              <p style={{ color: `rgba(${NAVY_RGB},0.72)`, fontSize: "15px", lineHeight: 1.7, margin: "0 0 22px", maxWidth: "62ch" }}>
                Not a member yet? Pricing and what's included are on the Pricing page. Lost your
                link? Contact us with the email you purchased with and we'll re-send it.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/pricing" style={{ background: COBALT, color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: "14px", padding: "12px 26px", borderRadius: "8px", display: "inline-block" }}>
                  See pricing →
                </Link>
                <Link href="/contact" style={{ background: "transparent", color: NAVY, textDecoration: "none", fontWeight: 600, fontSize: "14px", padding: "12px 26px", borderRadius: "8px", border: `1px solid rgba(${NAVY_RGB},0.3)`, display: "inline-block" }}>
                  Contact us
                </Link>
              </div>
            </div>
          ) : gate === "invalid" ? (
            <div style={panel}>
              <ErrorNote text="That access link isn't valid any more — it may have been refreshed by a newer purchase, or the purchase was refunded. Check your latest email from us, or contact us and we'll sort it." />
            </div>
          ) : gate === "wrong-product" ? (
            <div style={panel}>
              <ErrorNote text="Your access link is valid, but it belongs to a different product — one that doesn't include the Document Library. If you'd like access, the Complete Document Library or Academy + Documents bundle covers this." />
            </div>
          ) : gate === "error" ? (
            <div style={panel}>
              <ErrorNote text="Something went wrong checking your access. Try reloading the page — if it keeps failing, contact us." />
            </div>
          ) : (
            /* ── ready: library ── */
            <>
              <div style={{ ...panel, marginBottom: "20px", padding: isMobile ? "18px 20px" : "22px 28px" }}>
                <input
                  type="text"
                  placeholder="Search 380 documents by name or category…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box", padding: "13px 16px",
                    border: `1px solid rgba(${NAVY_RGB},0.2)`, borderRadius: "8px",
                    fontFamily: "'Poppins', sans-serif", fontSize: "15px", color: NAVY, outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
                  <CategoryPill label="All" active={activeCategory === null} onClick={() => setActiveCategory(null)} />
                  {CATEGORY_ORDER.map((c) => (
                    <CategoryPill
                      key={c.slug}
                      label={c.label}
                      active={activeCategory === c.slug}
                      onClick={() => setActiveCategory(c.slug === activeCategory ? null : c.slug)}
                    />
                  ))}
                </div>
                <p style={{ margin: "14px 0 0", fontSize: "13px", color: `rgba(${NAVY_RGB},0.55)` }}>
                  {filtered.length} of {DOCUMENT_CATALOGUE.length} documents
                </p>
              </div>

              {grouped.length === 0 ? (
                <div style={panel}>
                  <p style={{ margin: 0, color: `rgba(${NAVY_RGB},0.65)`, fontSize: "15px" }}>
                    No documents match "{query}".
                  </p>
                </div>
              ) : (
                grouped.map((cat) => (
                  <div key={cat.slug} style={{ ...panel, marginBottom: "16px" }}>
                    <h2 style={{ fontFamily: "var(--eba-heading)", fontWeight: 700, fontSize: "1.1rem", margin: "0 0 14px", color: NAVY }}>
                      {cat.label} <span style={{ color: `rgba(${NAVY_RGB},0.4)`, fontWeight: 500, fontSize: "0.85rem" }}>({cat.docs.length})</span>
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {cat.docs.map((d) => (
                        <a
                          key={`${d.categorySlug}/${d.relWithinCat}`}
                          href={downloadUrl(d)}
                          download
                          onClick={() => track("document_download", { category: d.categorySlug })}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
                            padding: "11px 10px", borderRadius: "6px", textDecoration: "none", color: NAVY,
                            fontSize: "14.5px", borderBottom: `1px solid rgba(${NAVY_RGB},0.06)`,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = `rgba(${COBALT_RGB},0.06)`)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                          <span style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "10px", color: `rgba(${NAVY_RGB},0.45)`, fontSize: "12.5px" }}>
                            <span style={{ textTransform: "uppercase" }}>{d.ext}</span>
                            <span>{formatSize(d.size)}</span>
                            <span style={{ color: COBALT, fontWeight: 600 }}>Download</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", fontWeight: 600,
        padding: "7px 14px", borderRadius: "999px", cursor: "pointer",
        border: active ? `1px solid ${COBALT}` : `1px solid rgba(${NAVY_RGB},0.18)`,
        background: active ? COBALT : "transparent",
        color: active ? "#fff" : NAVY,
      }}
    >
      {label}
    </button>
  );
}

function ErrorNote({ text }: { text: string }) {
  return (
    <div style={{ background: OAT, borderLeft: `3px solid #A6620B`, borderRadius: "6px", padding: "12px 16px" }}>
      <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: NAVY }}>{text}</p>
    </div>
  );
}
