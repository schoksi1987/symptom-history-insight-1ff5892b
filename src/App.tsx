import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/predict" element={<DiseasePrediction />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient/:id" element={<PatientDashboard />} />
          <Route path="/patient/:id/examination" element={<PatientExamination />} />
          <Route path="/patient/:id/sdoh" element={<SDOHAssessment />} />
          <Route path="/patient/:id/history" element={<PatientHistory />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-insights" element={<MyInsights />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
