import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { captureUtm } from "./lib/track";
import "./index.css";

// Persist any ?utm_* campaign params for this visit before the app renders.
captureUtm();

const container = document.getElementById("root")!;
const app = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// react-snap prerenders static HTML at build time; when that markup is present
// we hydrate it instead of throwing it away with a fresh client render.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
