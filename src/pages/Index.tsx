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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">Predict Disease</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button className="hover:text-primary transition-colors">Platform</button>
              <button className="hover:text-primary transition-colors">Solutions</button>
              <button className="hover:text-primary transition-colors">Resources</button>
            </nav>
            <div className="flex items-center gap-3">
              {user ? (
                <Button onClick={() => navigate("/dashboard")} size="lg">
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")} size="lg">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-background -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  The AI Platform for{" "}
                  <span className="text-primary">Diabetes Prediction.</span>
                </h1>
                
                <div className="space-y-3 text-xl mb-10">
                  <p className="font-medium">Improve patient outcomes.</p>
                  <p className="font-medium">Reduce healthcare costs.</p>
                  <p className="font-medium">Save clinicians time.</p>
                  <p className="text-muted-foreground mt-6">All in one AI-enabled platform.</p>
                </div>

                <Button 
                  onClick={() => navigate(user ? "/dashboard" : "/predict")} 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                  <img 
                    src="/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png" 
                    alt="Predict Disease Platform Interface" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Powered by Advanced AI
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transform diabetes risk assessment with clinical intelligence designed for primary care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Patient Journey Mapping</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize progression and identify critical intervention points
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Similar Patient Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Find patients with similar characteristics and outcomes
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <Target className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Risk Stratification</h3>
                <p className="text-sm text-muted-foreground">
                  Categorize patients by diabetes risk levels automatically
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Personalized Treatment</h3>
                <p className="text-sm text-muted-foreground">
                  Evidence-based recommendations for individual patients
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Seamless Clinical Workflow
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Enhance patient care without disrupting existing workflows
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Database className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Data Collection</h3>
                <p className="text-muted-foreground">
                  Automatically integrates with existing EHR systems and collects comprehensive patient data
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms process multiple data sources to generate accurate risk predictions
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
                <p className="text-muted-foreground">
                  Delivers personalized recommendations and identifies similar patient cases
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                See Predict Disease in Action
              </h2>
              <p className="text-xl text-muted-foreground">
                Experience how our platform transforms diabetes risk assessment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 group border-2 hover:border-primary/50">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Activity className="h-9 w-9 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Patient Dashboard</h3>
                  <p className="text-muted-foreground mb-8">
                    View comprehensive patient health metrics, symptom tracking, and risk indicators
                  </p>
                  <Button 
                    onClick={() => navigate(user ? "/dashboard" : "/predict")} 
                    className="w-full"
                    size="lg"
                  >
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all duration-300 group border-2 hover:border-primary/50">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <BarChart className="h-9 w-9 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Physician Dashboard</h3>
                  <p className="text-muted-foreground mb-8">
                    Explore population health insights and patient management tools
                  </p>
                  <Button 
                    onClick={() => navigate("/recommendations")} 
                    variant="outline" 
                    className="w-full"
                    size="lg"
                  >
                    View Insights
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-bold">Predict Disease</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering primary care with AI-driven diabetes prediction and personalized care.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Risk Assessment</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Patient Analytics</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Clinical Integration</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Clinical Evidence</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Implementation Guide</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Support Center</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Schedule Demo</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Provider Support</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Partnership</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Predict Disease. Advancing primary care through AI-powered diabetes prediction.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;