import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { FEATURE_FLAGS } from "./lib/feature-flags.ts";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

// Lazy-load non-critical routes
const ParentLogin = lazy(() => import("./pages/ParentLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const Newsletter = lazy(() => import("./pages/Newsletter.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Programs = lazy(() => import("./pages/Programs.tsx"));
const SummerCamp = lazy(() => import("./pages/SummerCamp.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsConditions = lazy(() => import("./pages/TermsConditions.tsx"));

// Defer chatbot loading
const ChatBot = lazy(() => import("./components/ChatBot.tsx"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SpeedInsights />
          <Analytics />
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/parent" element={<ParentLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/summer-camp" element={<SummerCamp />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        {FEATURE_FLAGS.chatbotEnabled && (
          <Suspense fallback={null}>
            <ChatBot />
          </Suspense>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
export default App;
