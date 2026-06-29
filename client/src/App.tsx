import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
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
import { AboutPage, DocumentsPage, ContactPage } from "@/pages/SupportingPages";
import { MentorshipPage, PricingPage, EnterprisePage, FAQPage } from "@/pages/PlaceholderPages";
import { PrivacyPolicyPage, TermsPage, CookieConsentBanner } from "@/pages/LegalPages";



function Router() {
  return (
    <Switch>
      {/* EBA Marketing Site */}
      <Route path={"/"} component={HomePage} />
      <Route path={"/academy"} component={AcademyPage} />
      <Route path={"/ai-tools"} component={AIToolsPage} />
      <Route path={"/ai-tools/om-manual"} component={AIToolsPage} />
      <Route path={"/ai-tools/compliance-chatbot"} component={AIToolsPage} />
      <Route path={"/about"} component={AboutPage} />
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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <Router />
          <CookieConsentBanner />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
