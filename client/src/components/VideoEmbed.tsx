/**
 * VideoEmbed — responsive Wistia iframe embed.
 *
 * Uses Wistia's plain responsive-iframe pattern (no external player script,
 * no tracking bundle) — https://fast.wistia.net/embed/iframe/{id}. If a
 * video's Wistia sharing settings ever restrict embedding by domain, this
 * will show a blank frame; check Sharing → Embed Options in the Wistia
 * dashboard for that media if so.
 */
export function VideoEmbed({
  wistiaId,
  title,
  ratio = "16 / 9",
}: {
  wistiaId: string;
  title: string;
  ratio?: string;
}) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: ratio, background: "#000", overflow: "hidden" }}>
      <iframe
        src={`https://fast.wistia.net/embed/iframe/${wistiaId}?seo=true&videoFoam=true`}
        title={title}
        allow="autoplay; fullscreen"
        allowFullScreen
        frameBorder={0}
        scrolling="no"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
