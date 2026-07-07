import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
const ParentNewsletter = lazy(() => import("./pages/ParentNewsletter.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Programs = lazy(() => import("./pages/Programs.tsx"));
const SummerCamp = lazy(() => import("./pages/SummerCamp.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsConditions = lazy(() => import("./pages/TermsConditions.tsx"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy.tsx"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy.tsx"));
const ContactUs = lazy(() => import("./pages/ContactUs.tsx"));


// Defer chatbot & scroll-to-top
const ChatBot = lazy(() => import("./components/ChatBot.tsx"));
const ScrollToTopButton = lazy(() => import("./components/ScrollToTopButton.tsx"));

import { AuthProvider, useAuth } from "./context/AuthContext.tsx";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Global interceptor to route Supabase Auth homepage redirects to correct portal */
function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, roles, isLoading } = useAuth();
  const [showOverlay, setShowOverlay] = useState(false);

  const hash = location.hash || window.location.hash;
  const search = location.search || window.location.search;
  const isHomepage = location.pathname === "/";

  const hasToken =
    hash.includes("access_token=") ||
    hash.includes("type=recovery") ||
    hash.includes("type=invite") ||
    hash.includes("type=signup") ||
    search.includes("token=") ||
    search.includes("code=") ||
    search.includes("type=invite") ||
    search.includes("type=recovery") ||
    search.includes("type=signup");

  useEffect(() => {
    if (isHomepage && hasToken) {
      setShowOverlay(true);
      
      // Once auth states have hydrated
      if (!isLoading) {
        if (user) {
          const isAdmin = roles.includes("admin");
          const targetPath = isAdmin ? "/admin/token" : "/parent/token";
          navigate(`${targetPath}${search}${hash}`, { replace: true });
        } else {
          // Timeout fallback if auth failed or user not hydrated
          const timer = setTimeout(() => {
            navigate("/parent", { replace: true });
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isHomepage, hasToken, isLoading, user, roles, navigate, search, hash]);

  // Network timeout safety fallback
  useEffect(() => {
    if (isHomepage && hasToken && showOverlay) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.warn("[AuthRedirectHandler] Session verification timed out, routing to parent portal");
          navigate("/parent", { replace: true });
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isHomepage, hasToken, showOverlay, isLoading, navigate]);

  if (isHomepage && hasToken && showOverlay) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
        <div className="bg-card/40 border border-border/50 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg text-foreground animate-pulse">Verifying Identity</h3>
            <p className="text-sm text-muted-foreground">Securing your session and redirecting you to your portal...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/** Defer rendering until browser is idle (after FCP/LCP) */
function useDeferredMount(delay = 3000) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: delay });
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setReady(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);
  return ready;
}

const App = () => {
  const chatReady = useDeferredMount(2000);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SpeedInsights />
              <Analytics />
              <ScrollToTop />
              <AuthRedirectHandler />
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/parent" element={<ParentLogin />} />
                  <Route path="/parent/token" element={<ParentLogin />} />
                  <Route path="/parent/newsletter" element={<ParentNewsletter />} />
                  <Route path="/admin" element={<AdminDashboard />} />

                  <Route path="/admin/token" element={<AdminDashboard />} />
                  <Route path="/newsletter" element={<Newsletter />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/summer-camp" element={<SummerCamp />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/refund" element={<RefundPolicy />} />
                  <Route path="/shipping" element={<ShippingPolicy />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          <Suspense fallback={null}>
            <ScrollToTopButton />
          </Suspense>
          {FEATURE_FLAGS.chatbotEnabled && chatReady && (
            <Suspense fallback={null}>
              <ChatBot />
            </Suspense>
          )}
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
export default App;
