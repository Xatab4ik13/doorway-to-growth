import { lazy, Suspense, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Eager load CRM (primary use case)
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";

// Lazy load storefront and partner pages
const Partner = lazy(() => import("./pages/Partner.tsx"));
const Storefront = lazy(() => import("./pages/Storefront.tsx"));
const StorefrontCatalog = lazy(() => import("./pages/StorefrontCatalog.tsx"));
const StorefrontProduct = lazy(() => import("./pages/StorefrontProduct.tsx"));
const StorefrontCart = lazy(() => import("./pages/StorefrontCart.tsx"));
const StorefrontBrand = lazy(() => import("./pages/StorefrontBrand.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

function LoginRoute() {
  const { session, role, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (session) {
    if (role === "partner") return <Navigate to="/partner" replace />;
    return <Navigate to="/" replace />;
  }
  return <Login />;
}

// Detect hosting mode from hostname
function useHostMode(): "crm" | "storefront" | "dev" {
  return useMemo(() => {
    const hostname = window.location.hostname;

    // Preview / localhost → dev mode (all routes)
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("lovable.app") ||
      hostname.includes("lovableproject.com")
    ) {
      return "dev";
    }

    // CRM subdomain
    if (hostname === "crm.brandoors.ru") return "crm";

    // Main domain (landing, future)
    if (hostname === "brandoors.ru" || hostname === "www.brandoors.ru") return "dev";

    // Any other subdomain of brandoors.ru → storefront
    if (hostname.endsWith(".brandoors.ru")) return "storefront";

    // Custom domain → storefront
    return "storefront";
  }, []);
}

function AppRoutes() {
  const mode = useHostMode();

  // In storefront mode, hostname determines the site — no /store/:slug needed
  if (mode === "storefront") {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/catalog" element={<StorefrontCatalog />} />
          <Route path="/product/:productSlug" element={<StorefrontProduct />} />
          <Route path="/cart" element={<StorefrontCart />} />
          <Route path="/brand" element={<StorefrontBrand />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    );
  }

  // CRM-only mode
  if (mode === "crm") {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<ProtectedRoute requiredRole="admin"><Index /></ProtectedRoute>} />
          <Route path="/partner" element={<ProtectedRoute requiredRole="partner"><Partner /></ProtectedRoute>} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    );
  }

  // Dev mode — all routes available
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<ProtectedRoute requiredRole="admin"><Index /></ProtectedRoute>} />
        <Route path="/partner" element={<ProtectedRoute requiredRole="partner"><Partner /></ProtectedRoute>} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/store/:slug" element={<Storefront />} />
        <Route path="/store/:slug/catalog" element={<StorefrontCatalog />} />
        <Route path="/store/:slug/product/:productSlug" element={<StorefrontProduct />} />
        <Route path="/store/:slug/cart" element={<StorefrontCart />} />
        <Route path="/store/:slug/brand" element={<StorefrontBrand />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
