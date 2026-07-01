/**
 * Photo — the site's single image treatment. Enforces a consistent look for every
 * real photograph (uniform rounded corners, soft shadow, controlled aspect ratio,
 * cover-fit, lazy load) plus an optional subtle cobalt tint so mixed sources —
 * studio headshots, phone shots, stock — read as one brand. Keep all real imagery
 * going through this component.
 */
import { ACCENT_RGB, NAVY_RGB } from "@/lib/constants";

export function Photo({
  src,
  alt,
  ratio = "4 / 3",
  radius = "18px",
  tint = "none",
  focus = "center",
  shadow = true,
  className,
  style,
}: {
  src: string;
  alt: string;
  ratio?: string;                 // e.g. "4 / 3", "3 / 4", "16 / 9", "1 / 1"
  radius?: string;
  tint?: "none" | "soft" | "duo"; // brand tint strength
  focus?: string;                 // object-position, e.g. "center 30%"
  shadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const overlay =
    tint === "duo"
      ? `linear-gradient(135deg, rgba(${ACCENT_RGB},0.34) 0%, rgba(${NAVY_RGB},0.30) 100%)`
      : tint === "soft"
        ? `linear-gradient(135deg, rgba(${ACCENT_RGB},0.14) 0%, rgba(${ACCENT_RGB},0.02) 60%)`
        : null;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: ratio,
        borderRadius: radius,
        overflow: "hidden",
        boxShadow: shadow ? "0 34px 70px -34px rgba(0,0,0,0.42)" : "none",
        background: `rgba(${NAVY_RGB},0.05)`,
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, display: "block" }}
      />
      {overlay && (
        <div aria-hidden style={{ position: "absolute", inset: 0, background: overlay, mixBlendMode: "multiply", pointerEvents: "none" }} />
      )}
    </div>
  );
}
