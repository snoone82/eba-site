/**
 * Build-time render for one route. Used by scripts/prerender.mjs after `vite build`.
 * The client entry (main.tsx) still hydrates this markup in the browser.
 */
import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { Router } from "wouter";
import App from "./App";

export function render(url: string): { html: string; helmet: HelmetServerState } {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <Router ssrPath={url}>
        <App />
      </Router>
    </HelmetProvider>,
  );
  if (!helmetContext.helmet) {
    throw new Error(`Helmet did not render for ${url}`);
  }
  return { html, helmet: helmetContext.helmet };
}
