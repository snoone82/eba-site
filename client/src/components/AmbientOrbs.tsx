/**
 * AmbientOrbs — soft, blurred gradient "orbs" that sit behind a section to give
 * empty areas gentle depth and colour (the Citation / iHasco feel) without
 * fabricated imagery. Purely decorative and non-interactive; renders nothing on
 * the default/noir themes where the orb tokens are empty.
 *
 * Usage: put inside a `position: relative; overflow: hidden` section, then place
 * the real content in a `position: relative; zIndex: 1` wrapper above it.
 */
import { ORB_ACCENT, ORB_WARM } from "@/lib/constants";

type OrbSpec = {
  bg: string;
  size: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

export function AmbientOrbs({ orbs }: { orbs?: OrbSpec[] }) {
  if (!ORB_ACCENT) return null;

  const specs: OrbSpec[] =
    orbs ?? [
      { bg: ORB_ACCENT, size: "440px", top: "-140px", right: "-120px" },
      { bg: ORB_WARM, size: "380px", bottom: "-160px", left: "-120px" },
    ];

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {specs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: o.size,
            height: o.size,
            top: o.top,
            bottom: o.bottom,
            left: o.left,
            right: o.right,
            background: o.bg,
            filter: "blur(8px)",
          }}
        />
      ))}
    </div>
  );
}
