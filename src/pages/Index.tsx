import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Brain,
  Users,
  Activity,
  ArrowRight,
  Heart,
  Stethoscope,
  TrendingUp,
  Database,
  Shield,
  CheckCircle2,
  Star,
  BarChart3,
  UserCheck,
  Globe,
  Dna,
  Home,
  Target
} from "lucide-react";

const Index = () => {
  const dataSourceCards = [
    {
      title: "Clinical Data",
      description: "Lab results, vitals, medical history, and diagnostic markers",
      icon: Stethoscope,
      stats: "15+ clinical markers",
      color: "bg-blue-500"
    },
    {
      title: "Lifestyle Factors",
      description: "Diet, exercise, sleep patterns, and behavioral indicators",
      icon: Activity,
      stats: "25+ lifestyle metrics",
      color: "bg-green-500"
    },
    {
      title: "Family History",
      description: "Genetic predisposition and hereditary risk factors",
      icon: Dna,
      stats: "3-generation analysis",
      color: "bg-purple-500"
    },
    {
      title: "Social Forum Data",
      description: "Community health insights and peer behavior patterns",
      icon: Users,
      stats: "Real-time insights",
      color: "bg-orange-500"
    },
    {
      title: "SDOH Data",
      description: "Social determinants: housing, income, education, food security",
      icon: Home,
      stats: "12 SDOH factors",
      color: "bg-teal-500"
    },
    {
      title: "Research Data",
      description: "Latest medical research and population health studies",
      icon: Database,
      stats: "1000+ studies",
      color: "bg-indigo-500"
    }
  ];

  const keyFeatures = [
    {
      title: "Patient Journey Mapping",
      description: "Visualize patient progression and identify intervention points",
      icon: TrendingUp
    },
    {
      title: "Similar Patient Matching",
      description: "Find patients with similar characteristics and outcomes",
      icon: UserCheck
    },
    {
      title: "Risk Stratification",
      description: "Categorize patients by diabetes risk levels",
      icon: Target
    },
    {
      title: "Personalized Treatment",
      description: "Evidence-based recommendations for individual patients",
      icon: Heart
    }
  ];

  const outcomes = [
    { metric: "Early Detection Rate", value: "85%", improvement: "+40%" },
    { metric: "Risk Prediction Accuracy", value: "92%", improvement: "+25%" },
    { metric: "Patient Engagement", value: "78%", improvement: "+60%" },
    { metric: "Treatment Adherence", value: "73%", improvement: "+35%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">T2D Predict</h1>
                <p className="text-xs text-muted-foreground">Primary Care AI</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="#platform" className="text-muted-foreground hover:text-primary transition-colors">Platform</Link>
              <Link to="#outcomes" className="text-muted-foreground hover:text-primary transition-colors">Outcomes</Link>
              <Link to="#demo" className="text-muted-foreground hover:text-primary transition-colors">Demo</Link>
              <Button variant="outline" size="sm">Provider Login</Button>
              <Button size="sm">Request Access</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              <Star className="h-4 w-4 mr-2" />
              AI-Powered Primary Care Solution
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Predict Type 2 Diabetes Risk
              <span className="text-primary"> Before It's Too Late</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Comprehensive AI platform that integrates clinical data, lifestyle factors, family history, 
              social determinants, and research insights to help primary care physicians identify 
              at-risk patients and provide personalized treatment recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/recommendations">
                <Button size="lg" className="w-full sm:w-auto">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  View Patient Demo
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Schedule Demo Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {outcomes.map((outcome, index) => (
                <Card key={index} className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">{outcome.value}</div>
                  <div className="text-sm font-medium">{outcome.metric}</div>
                  <div className="text-xs text-green-600 font-medium">{outcome.improvement}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section id="platform" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Comprehensive Data Integration</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI platform analyzes multiple data sources to provide the most accurate 
              diabetes risk assessment for primary care decision making
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSourceCards.map((source, index) => {
              const IconComponent = source.icon;
              return (
                <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg ${source.color}/10`}>
                        <IconComponent className={`h-6 w-6 text-white`} style={{color: source.color.replace('bg-', '').replace('-500', '')}} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {source.stats}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{source.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {source.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Advanced Clinical Intelligence</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Identify patient journey patterns, find similar cases, and deliver personalized care recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical Workflow */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Seamless Clinical Workflow</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Designed specifically for primary care physicians to enhance patient care without disrupting existing workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto p-6 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center">
                <Database className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Data Collection</h3>
              <p className="text-muted-foreground">
                Automatically integrates with existing EHR systems and collects comprehensive patient data
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto p-6 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Advanced algorithms process multiple data sources to generate accurate risk predictions
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto p-6 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Actionable Insights</h3>
              <p className="text-muted-foreground">
                Delivers personalized recommendations and identifies similar patient cases for informed decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">See T2D Predict in Action</h2>
            <p className="text-xl text-muted-foreground">
              Experience how our platform transforms diabetes risk assessment in primary care settings
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Patient Dashboard</h3>
                <p className="text-muted-foreground mb-6">
                  View comprehensive patient health metrics, symptom tracking, and risk indicators
                </p>
                <Link to="/recommendations">
                  <Button className="w-full">
                    View Demo Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Clinical Analytics</h3>
                <p className="text-muted-foreground mb-6">
                  Explore population health insights and patient journey analytics
                </p>
                <Button variant="outline" className="w-full">
                  Request Demo Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-6 w-6 text-primary" />
                <div>
                  <span className="font-bold text-lg">T2D Predict</span>
                  <p className="text-xs text-muted-foreground">Primary Care AI</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering primary care physicians with AI-driven diabetes prediction and personalized patient care.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Risk Assessment</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Patient Analytics</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Clinical Integration</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Clinical Evidence</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Implementation Guide</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Support Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Schedule Demo</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Provider Support</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Partnership</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 T2D Predict. Advancing primary care through AI-powered diabetes prediction.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;