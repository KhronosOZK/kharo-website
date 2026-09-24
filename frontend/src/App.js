import { useEffect, lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import LaunchBanner from "@/components/LaunchBanner";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import HomeFunctional from "@/pages/HomeFunctional";
import { trackEvent } from "@/lib/api";
import { EASE } from "@/lib/motion";

// Every route except Home is code-split: Home is the most common landing
// page (organic, ads, direct), so it ships in the main bundle to render
// immediately, while every other route only downloads its own chunk when a
// visitor actually navigates there.
// A chunk can fail to load when a deploy lands between two navigations (the
// page holds the old chunk names). Reload once to pick up the new build,
// then let the error surface if it still fails.
const lazyRetry = (load) => lazy(() => load().catch((err) => {
  const isChunkError = err?.name === "ChunkLoadError" || /Loading chunk|Failed to fetch dynamically imported module/i.test(err?.message || "");
  if (isChunkError && !sessionStorage.getItem("kharo_chunk_retry")) {
    sessionStorage.setItem("kharo_chunk_retry", "1");
    window.location.reload();
    return new Promise(() => {});
  }
  throw err;
}));

const SearchResults = lazyRetry(() => import("@/pages/SearchResults"));
const VehicleDetail = lazyRetry(() => import("@/pages/VehicleDetail"));
const Apply = lazyRetry(() => import("@/pages/Apply"));
const Register = lazyRetry(() => import("@/pages/Register"));
const OperatorInterest = lazyRetry(() => import("@/pages/OperatorInterest"));
const DriverGuide = lazyRetry(() => import("@/pages/DriverGuide"));
const ForDrivers = lazyRetry(() => import("@/pages/ForDrivers"));
const OperatorGuide = lazyRetry(() => import("@/pages/OperatorGuide"));
const Admin = lazyRetry(() => import("@/pages/Admin"));
const WhyKharo = lazyRetry(() => import("@/pages/WhyKharo"));
const About = lazyRetry(() => import("@/pages/About"));
const Help = lazyRetry(() => import("@/pages/Help"));
const Legal = lazyRetry(() => import("@/pages/Legal"));
const Saved = lazyRetry(() => import("@/pages/Saved"));
const Compare = lazyRetry(() => import("@/pages/Compare"));
const RequestCar = lazyRetry(() => import("@/pages/RequestCar"));
const CityPage = lazyRetry(() => import("@/pages/CityPage"));
const Login = lazyRetry(() => import("@/pages/Login"));
const OperatorLogin = lazyRetry(() => import("@/pages/OperatorLogin"));
const ForgotPassword = lazyRetry(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazyRetry(() => import("@/pages/ResetPassword"));
const DriverPortal = lazyRetry(() => import("@/pages/DriverPortal"));
const OperatorDashboard = lazyRetry(() => import("@/pages/OperatorDashboard"));
const NotFound = lazyRetry(() => import("@/pages/NotFound"));

function RouteTracker() {
  const loc = useLocation();
  useEffect(() => {
    trackEvent("page_view", { path: loc.pathname });
    sessionStorage.removeItem("kharo_chunk_retry");
  }, [loc.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// One route entrance, owned by the router: 220ms fade with a 6px lift, no
// exit (an exit would delay navigation). Scroll resets instantly so the new
// page never appears to slide up from wherever the last one was.
function RouteShell({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: EASE.out }}
    >
      {children}
    </motion.div>
  );
}

// Header and footer stay mounted outside Suspense, so a route chunk loading
// only blanks the content area rather than flashing the whole page.
function RouteFallback() {
  // The shape of a browse page, greyed, so a chunk loading never looks like
  // a broken page: a heading bar and six card outlines.
  return (
    <div className="min-h-[60vh] bg-bone" aria-busy="true" aria-label="Loading">
      <div className="wrap pt-10">
        <div className="h-7 w-48 rounded-md bg-surface-2 motion-safe:animate-pulse" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-line bg-surface p-3">
              <div className="aspect-[16/10] rounded-md bg-surface-2 motion-safe:animate-pulse" />
              <div className="mt-3 h-4 w-2/3 rounded bg-surface-2" />
              <div className="mt-2 h-3 w-1/2 rounded bg-surface-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <BrowserRouter>
            <RouteTracker />
            <LaunchBanner />
            <Header />
            <Suspense fallback={<RouteFallback />}>
              <RouteShell>
                <Routes>
                  <Route path="/" element={<HomeFunctional />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/vehicle/:id" element={<VehicleDetail />} />
                  <Route path="/apply/:id" element={<Apply />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/list-your-fleet" element={<OperatorInterest />} />
                  <Route path="/driver-guide" element={<DriverGuide />} />
                  <Route path="/for-drivers" element={<ForDrivers />} />
                  <Route path="/operator-guide" element={<OperatorGuide />} />
                  <Route path="/why-kharo" element={<WhyKharo />} />
                  <Route path="/why-caro" element={<Navigate to="/why-kharo" replace />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/saved" element={<Saved />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/request-a-car" element={<RequestCar />} />
                  <Route path="/city/:name" element={<CityPage />} />
                  {/* Account routes. The backend emails /reset-password?token=,
                      so that route must exist even pre-launch. */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/operator-login" element={<OperatorLogin />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/driver-portal" element={<DriverPortal />} />
                  <Route path="/operator-dashboard" element={<OperatorDashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </RouteShell>
            </Suspense>
            <Footer />
            <CookieConsent />
            <Toaster position="top-center" richColors />
          </BrowserRouter>
        </AuthProvider>
      </MotionConfig>
    </div>
  );
}

export default App;
