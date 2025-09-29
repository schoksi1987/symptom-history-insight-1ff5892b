import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { 
  Heart, 
  Shield, 
  Brain, 
  Users, 
  TrendingUp, 
  Database, 
  Target, 
  Activity,
  BarChart,
  Stethoscope,
  FileText,
  Eye,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Predict Disease</h1>
              <span className="ml-2 text-sm text-blue-600">Primary Care AI</span>
            </div>
            <div className="space-x-4">
              {user ? (
                <Button onClick={() => navigate("/dashboard")} variant="default">
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")} variant="default">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Advanced Clinical Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
            Identify patient journey patterns, find similar cases, and deliver personalized care recommendations
          </p>

          {/* Clinical Intelligence Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-4" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold">Patient Journey Mapping</h3>
                  <p className="text-gray-600">Visualize patient progression and identify intervention points</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-green-600 mr-4" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold">Similar Patient Matching</h3>
                  <p className="text-gray-600">Find patients with similar characteristics and outcomes</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-orange-600 mr-4" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold">Risk Stratification</h3>
                  <p className="text-gray-600">Categorize patients by diabetes risk levels</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-red-600 mr-4" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold">Personalized Treatment</h3>
                  <p className="text-gray-600">Evidence-based recommendations for individual patients</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-20 bg-white rounded-2xl shadow-sm mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seamless Clinical Workflow
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Designed specifically for primary care physicians to enhance patient care without disrupting existing workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Data Collection</h3>
              <p className="text-gray-600">
                Automatically integrates with existing EHR systems and collects comprehensive patient data
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Advanced algorithms process multiple data sources to generate accurate risk predictions
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Actionable Insights</h3>
              <p className="text-gray-600">
                Delivers personalized recommendations and identifies similar patient cases for informed decisions
              </p>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            See Predict Disease in Action
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Experience how our platform transforms diabetes risk assessment in primary care settings
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 group">
              <div className="text-center">
                <Activity className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Patient Dashboard</h3>
                <p className="text-gray-600 mb-8">
                  View comprehensive patient health metrics, symptom tracking, and risk indicators
                </p>
                <Button 
                  onClick={() => navigate(user ? "/dashboard" : "/predict")} 
                  className="w-full group-hover:bg-blue-700 transition-colors"
                  size="lg"
                >
                  View Demo Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 group">
              <div className="text-center">
                <BarChart className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Physician Dashboard</h3>
                <p className="text-gray-600 mb-8">
                  Explore population health insights and patient management tools
                </p>
                <Button 
                  onClick={() => navigate("/recommendations")} 
                  variant="outline" 
                  className="w-full group-hover:bg-green-50 transition-colors"
                  size="lg"
                >
                  View Physician Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                <span className="font-semibold">Predict Disease</span>
              </div>
              <p className="text-gray-600 text-sm">
                Empowering primary care physicians with AI-driven diabetes prediction and personalized patient care.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Risk Assessment</li>
                <li>Patient Analytics</li>
                <li>Clinical Integration</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Clinical Evidence</li>
                <li>Implementation Guide</li>
                <li>Support Center</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Schedule Demo</li>
                <li>Provider Support</li>
                <li>Partnership</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            © 2024 Predict Disease. Advancing primary care through AI-powered diabetes prediction.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;