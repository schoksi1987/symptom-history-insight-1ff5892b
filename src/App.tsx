import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DiseasePrediction from "./pages/DiseasePrediction";
import Recommendations from "./pages/Recommendations";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import PatientExamination from "./pages/PatientExamination";
import SDOHAssessment from "./pages/SDOHAssessment";
import PatientHistory from "./pages/PatientHistory";
import OAuthConsent from "./pages/OAuthConsent";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";
import MyInsights from "./pages/MyInsights";
import ClinicalEvidence from "./pages/ClinicalEvidence";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const guarded = (element: React.ReactNode, requireAdmin = false) => (
  <ProtectedRoute requireAdmin={requireAdmin}>{element}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <WorkspaceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/predict" element={guarded(<DiseasePrediction />)} />
              <Route path="/recommendations" element={guarded(<Recommendations />)} />
              <Route path="/recommendations/:id" element={guarded(<Recommendations />)} />
              <Route path="/dashboard" element={guarded(<Dashboard />)} />
              <Route path="/patient/:id" element={guarded(<PatientDashboard />)} />
              <Route path="/patient/:id/examination" element={guarded(<PatientExamination />)} />
              <Route path="/patient/:id/sdoh" element={guarded(<SDOHAssessment />)} />
              <Route path="/patient/:id/history" element={guarded(<PatientHistory />)} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
              <Route path="/analytics" element={guarded(<Analytics />)} />
              <Route path="/admin" element={guarded(<Admin />, true)} />
              <Route path="/my-insights" element={guarded(<MyInsights />)} />
              <Route path="/clinical-evidence" element={guarded(<ClinicalEvidence />)} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </WorkspaceProvider>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
