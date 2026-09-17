import { useEffect, lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Home from "@/pages/Home";
import { trackEvent } from "@/lib/api";

// Every route except Home is code-split: Home is the most common landing
// page (organic, ads, direct), so it ships in the main bundle to render
// immediately, while every other route only downloads its own chunk when a
// visitor actually navigates there. This is what took the single ~435kB
// gzipped bundle down to a small shell plus per-route chunks.
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const VehicleDetail = lazy(() => import("@/pages/VehicleDetail"));
const Apply = lazy(() => import("@/pages/Apply"));
const Register = lazy(() => import("@/pages/Register"));
const OperatorInterest = lazy(() => import("@/pages/OperatorInterest"));
const DriverGuide = lazy(() => import("@/pages/DriverGuide"));
const ForDrivers = lazy(() => import("@/pages/ForDrivers"));
const OperatorGuide = lazy(() => import("@/pages/OperatorGuide"));
const Admin = lazy(() => import("@/pages/Admin"));
const WhyKharo = lazy(() => import("@/pages/WhyKharo"));
const Help = lazy(() => import("@/pages/Help"));
const Legal = lazy(() => import("@/pages/Legal"));
const Saved = lazy(() => import("@/pages/Saved"));
const Compare = lazy(() => import("@/pages/Compare"));
const RequestCar = lazy(() => import("@/pages/RequestCar"));
const CityPage = lazy(() => import("@/pages/CityPage"));
const Login = lazy(() => import("@/pages/Login"));
const OperatorLogin = lazy(() => import("@/pages/OperatorLogin"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const DriverPortal = lazy(() => import("@/pages/DriverPortal"));
const OperatorDashboard = lazy(() => import("@/pages/OperatorDashboard"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const MarketplaceDetail = lazy(() => import("@/pages/MarketplaceDetail"));
const SellYourCar = lazy(() => import("@/pages/SellYourCar"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteTracker() {
  const loc = useLocation();
  useEffect(() => { trackEvent("page_view", { path: loc.pathname }); }, [loc.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// Header and footer stay mounted outside Suspense, so a route chunk loading
// only blanks the content area rather than flashing the whole page.
function RouteFallback() {
  return <div className="min-h-[60vh]" />;
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <RouteTracker />
          <Header />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route path="/help" element={<Help />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/request-a-car" element={<RequestCar />} />
              <Route path="/city/:name" element={<CityPage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/:id" element={<MarketplaceDetail />} />
              <Route path="/sell-your-car" element={<SellYourCar />} />
              <Route path="/buy-a-car" element={<Navigate to="/marketplace" replace />} />
              {/* Account routes. These pages were built and linked from within
                  the app but had no route, so every link fell through to the
                  catch-all and bounced to the homepage. Password reset was
                  broken end to end: the backend emails /reset-password?token=,
                  which resolved to nothing. */}
              <Route path="/login" element={<Login />} />
              <Route path="/operator-login" element={<OperatorLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/driver-portal" element={<DriverPortal />} />
              <Route path="/operator-dashboard" element={<OperatorDashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          <CookieConsent />
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
