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
import Platform from "./pages/public/Platform";
import HowItWorks from "./pages/public/HowItWorks";
import ClinicalApproach from "./pages/public/ClinicalApproach";
import Implementation from "./pages/public/Implementation";
import ImplementationGuide from "./pages/public/ImplementationGuide";
import Support from "./pages/public/Support";
import About from "./pages/public/About";
import Partnerships from "./pages/public/Partnerships";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import MedicalDisclaimer from "./pages/public/MedicalDisclaimer";
import ResponsibleAI from "./pages/public/ResponsibleAI";
import Security from "./pages/public/Security";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const guarded = (element: React.ReactNode, requireAdmin = false, requireDemo = false) => (
  <ProtectedRoute requireAdmin={requireAdmin} requireDemo={requireDemo}>
    {element}
  </ProtectedRoute>
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
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/platform" element={<Platform />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/clinical-approach" element={<ClinicalApproach />} />
              <Route path="/clinical-evidence" element={<ClinicalEvidence />} />
              <Route path="/implementation" element={<Implementation />} />
              <Route path="/implementation-guide" element={<ImplementationGuide />} />
              <Route path="/support" element={<Support />} />
              <Route path="/about" element={<About />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
              <Route path="/responsible-ai" element={<ResponsibleAI />} />
              <Route path="/security" element={<Security />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

              {/* Approved accounts only */}
              <Route path="/predict" element={guarded(<DiseasePrediction />, false, true)} />
              <Route path="/recommendations" element={guarded(<Recommendations />)} />
              <Route path="/recommendations/:id" element={guarded(<Recommendations />)} />
              <Route path="/dashboard" element={guarded(<Dashboard />)} />
              <Route path="/patient/:id" element={guarded(<PatientDashboard />)} />
              <Route path="/patient/:id/examination" element={guarded(<PatientExamination />)} />
              <Route path="/patient/:id/sdoh" element={guarded(<SDOHAssessment />)} />
              <Route path="/patient/:id/history" element={guarded(<PatientHistory />)} />
              <Route path="/analytics" element={guarded(<Analytics />)} />
              <Route path="/my-insights" element={guarded(<MyInsights />)} />

              {/* Admin only */}
              <Route path="/admin" element={guarded(<Admin />, true)} />

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
