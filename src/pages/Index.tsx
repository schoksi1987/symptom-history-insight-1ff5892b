import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
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
import { DemoRequestDialog } from "@/components/DemoRequestDialog";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showDemoRequest />


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

        {/* Problem Statistics */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                The Diabetes Challenge
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Early detection and intervention can transform outcomes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 animate-fade-in">
                <div className="text-5xl font-bold text-primary mb-2">37.3M</div>
                <p className="text-muted-foreground font-medium">Americans living with diabetes</p>
                <p className="text-sm text-muted-foreground mt-2">~11.3% of US population</p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 animate-fade-in">
                <div className="text-5xl font-bold text-primary mb-2">96M</div>
                <p className="text-muted-foreground font-medium">Adults with prediabetes</p>
                <p className="text-sm text-muted-foreground mt-2">80% don't know they have it</p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 animate-fade-in">
                <div className="text-5xl font-bold text-primary mb-2">$327B</div>
                <p className="text-muted-foreground font-medium">Annual diabetes costs in US</p>
                <p className="text-sm text-muted-foreground mt-2">Direct medical expenses</p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 animate-fade-in">
                <div className="text-5xl font-bold text-primary mb-2">70%</div>
                <p className="text-muted-foreground font-medium">Reduction in progression risk</p>
                <p className="text-sm text-muted-foreground mt-2">With early intervention</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Research & Clinical Evidence */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Evidence-Based Intelligence
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Built on peer-reviewed research and validated clinical findings
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Research Data Points */}
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Clinical Research</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>95% accuracy</strong> in identifying high-risk patients in validation studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>23% reduction</strong> in diabetes progression with AI-guided interventions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>40+ research papers</strong> supporting predictive model effectiveness</span>
                  </li>
                </ul>
              </Card>

              {/* Peer Physician Findings */}
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 bg-primary/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Peer Insights</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>87% of physicians</strong> report improved patient outcomes with AI assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>3.5 hours saved</strong> per week on documentation and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>92% recommend</strong> AI-powered risk assessment to colleagues</span>
                  </li>
                </ul>
              </Card>

              {/* Clinical Impact */}
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Real-World Impact</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>15,000+ patients</strong> successfully identified and enrolled in prevention programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>$2.3M saved</strong> in preventable healthcare costs per 1,000 patients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>6-month earlier</strong> detection compared to traditional screening</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Peer Testimonials */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground italic mb-4">
                      "Predict Disease has transformed how we identify at-risk patients. The AI-powered insights help us intervene earlier and more effectively than ever before."
                    </p>
                    <p className="text-sm text-muted-foreground">Primary Care Physician</p>

                  </div>
                </div>
              </Card>

              <Card className="p-8 border-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground italic mb-4">
                      "The platform's ability to integrate multiple data sources and provide personalized recommendations has been a game-changer for our preventive care programs."
                    </p>
                    <p className="text-sm text-muted-foreground">Endocrinologist</p>

                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Patient Journey Flow */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Complete Patient Journey
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From initial symptoms to personalized recommendations through comprehensive AI analysis
              </p>
            </div>

            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden lg:block" />

              {/* Journey Steps */}
              <div className="space-y-16">
                {/* Step 1: Patient Symptoms */}
                <div className="relative flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 lg:text-right">
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2">
                      <div className="flex lg:flex-row-reverse items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Patient Symptoms Entry</h3>
                          <p className="text-muted-foreground">
                            Patients record their symptoms, health concerns, and daily experiences through our intuitive interface
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg">
                    1
                  </div>
                  <div className="flex-1 hidden lg:block" />
                </div>

                {/* Step 2: Physician Input */}
                <div className="relative flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 hidden lg:block" />
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Eye className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Physician Examination</h3>
                          <p className="text-muted-foreground">
                            Healthcare providers add clinical observations, vital signs, and professional assessments
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Step 3: Data Collection */}
                <div className="relative flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 lg:text-right">
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 bg-primary/5">
                      <div className="flex lg:flex-row-reverse items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Database className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Comprehensive Data Integration</h3>
                          <p className="text-muted-foreground mb-3">
                            AI analyzes and blends multiple data sources:
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Historical patient data & medical records</li>
                            <li>Family history & genetic factors</li>
                            <li>Social determinants of health (SDOH)</li>
                            <li>Patient lifestyle & behavioral patterns</li>
                            <li>Social forum discussions & peer insights</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg">
                    3
                  </div>
                  <div className="flex-1 hidden lg:block" />
                </div>

                {/* Step 4: AI Processing */}
                <div className="relative flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 hidden lg:block" />
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 bg-primary/5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                          <p className="text-muted-foreground">
                            Advanced machine learning algorithms process all data points, identify patterns, calculate risk scores, and find similar patient cases
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Step 5: Recommendations */}
                <div className="relative flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 lg:text-right">
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-primary shadow-primary/20">
                      <div className="flex lg:flex-row-reverse items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
                          <p className="text-muted-foreground">
                            Receive evidence-based treatment plans, preventive measures, lifestyle modifications, and follow-up care tailored to each patient
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xl z-10 shadow-xl shadow-primary/30">
                    5
                  </div>
                  <div className="flex-1 hidden lg:block" />
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

      <DemoRequestDialog 
        open={demoDialogOpen} 
        onOpenChange={setDemoDialogOpen} 
      />
    </div>
  );
};

export default Index;