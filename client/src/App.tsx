import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

// EBA Marketing Site pages
import HomePage from "@/pages/HomePage";
import AcademyPage from "@/pages/AcademyPage";
import AIToolsPage from "@/pages/AIToolsPage";
import { OurStoryPage, DocumentsPage, ContactPage } from "@/pages/SupportingPages";
import { MentorshipPage, PricingPage, EnterprisePage, FAQPage } from "@/pages/PlaceholderPages";
import { PrivacyPolicyPage, TermsPage, CookieConsentBanner } from "@/pages/LegalPages";
import { AboutStePage } from "@/pages/AboutStePage";
import { AssistantWidget } from "@/components/AssistantWidget";



function Router() {
  return (
    <Switch>
      {/* EBA Marketing Site */}
      <Route path={"/"} component={HomePage} />
      <Route path={"/academy"} component={AcademyPage} />
      <Route path={"/ai-tools"} component={AIToolsPage} />
      <Route path={"/ai-tools/om-manual"} component={AIToolsPage} />
      <Route path={"/ai-tools/compliance-chatbot"} component={AIToolsPage} />
      <Route path={"/our-story"} component={OurStoryPage} />
      {/* DRAFT — noIndex, deliberately not in the nav or sitemap until copy is final. */}
      <Route path={"/about-ste"} component={AboutStePage} />
      {/* Legacy /about → /our-story (client-side; a 308 redirect is also set in vercel.json) */}
      <Route path={"/about"}>{() => <Redirect to="/our-story" replace />}</Route>
      <Route path={"/documents"} component={DocumentsPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/mentorship"} component={MentorshipPage} />
      <Route path={"/pricing"} component={PricingPage} />
      <Route path={"/enterprise"} component={EnterprisePage} />
      <Route path={"/faq"} component={FAQPage} />
      <Route path={"/privacy-policy"} component={PrivacyPolicyPage} />
      <Route path={"/terms"} component={TermsPage} />



      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// react-snap prerenders with a "ReactSnap" user agent. The Vercel analytics
// scripts (/_vercel/*.js) don't exist during prerender and would 404 → HTML →
// script parse errors that fail the static build, so skip them while snapping.
const IS_PRERENDER =
  typeof navigator !== "undefined" && navigator.userAgent.includes("ReactSnap");

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
          <AssistantWidget />
          <CookieConsentBanner />
          {!IS_PRERENDER && <Analytics />}
          {!IS_PRERENDER && <SpeedInsights />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
