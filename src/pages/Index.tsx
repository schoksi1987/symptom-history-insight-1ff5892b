import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Brain,
  Users,
  Shield,
  Activity,
  ArrowRight,
  Building,
  Heart,
  Stethoscope,
  TrendingUp,
  Database,
  Cloud,
  BarChart3,
  Clock,
  CheckCircle2,
  Star
} from "lucide-react";

const Index = () => {
  const services = [
    {
      title: "AI Disease Prediction",
      description: "Advanced machine learning algorithms to predict Type 2 diabetes risk at primary care settings",
      icon: Brain,
      buttonText: "Get Risk Assessment",
      buttonLink: "/recommendations"
    },
    {
      title: "Patient Monitoring",
      description: "Comprehensive tracking of symptoms, vitals, and health metrics for better outcomes",
      icon: Activity,
      buttonText: "View Dashboard",
      buttonLink: "/recommendations"
    }
  ];

  const specialties = [
    { name: "Endocrinology", icon: Heart },
    { name: "General Practice", icon: Stethoscope },
    { name: "Internal Medicine", icon: Activity },
    { name: "Preventive Care", icon: Shield },
    { name: "Chronic Disease", icon: TrendingUp },
    { name: "Primary Care", icon: Users }
  ];

  const partners = [
    { name: "Healthcare Providers", icon: Building, description: "Hospitals and clinics" },
    { name: "Medical Practices", icon: Stethoscope, description: "Primary care physicians" },
    { name: "Health Plans", icon: Shield, description: "Insurance companies" },
    { name: "Research Institutions", icon: Database, description: "Medical research" },
    { name: "Government", icon: Building, description: "Public health agencies" },
    { name: "Individuals", icon: Users, description: "Patients and families" }
  ];

  const features = [
    { name: "Big Data Analytics", icon: Database, description: "Process vast amounts of health data" },
    { name: "Cloud Infrastructure", icon: Cloud, description: "Secure and scalable platform" },
    { name: "Real-time Analytics", icon: BarChart3, description: "Instant insights and predictions" },
    { name: "Continuous Monitoring", icon: Clock, description: "24/7 patient health tracking" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">DiabetesPredict AI</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link>
              <Link to="#about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="#partners" className="text-muted-foreground hover:text-primary transition-colors">Partners</Link>
              <Button variant="outline" size="sm">Login</Button>
              <Button size="sm">Request Demo</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  <Star className="h-4 w-4 mr-2" />
                  AI-Powered Healthcare
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Predict Type 2 Diabetes Risk with 
                  <span className="text-primary"> AI Precision</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Advanced machine learning platform for early diabetes detection at primary care settings. 
                  Empowering healthcare providers with predictive insights for better patient outcomes.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>95% Accuracy Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Real-time Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Easy Integration</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/recommendations">
                  <Button size="lg" className="w-full sm:w-auto">
                    Try Demo Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Request Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl shadow-2xl p-8 border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Patient Risk Analysis</h3>
                    <Badge variant="destructive">HIGH RISK</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Diabetes Risk Score</span>
                      <span className="text-2xl font-bold text-destructive">71%</span>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: "Lifestyle Factors", value: 72, color: "bg-red-500" },
                        { label: "Genetic Predisposition", value: 45, color: "bg-yellow-500" },
                        { label: "Clinical Markers", value: 68, color: "bg-red-500" },
                        { label: "Social Determinants", value: 30, color: "bg-green-500" }
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.label}</span>
                            <span className="font-medium">{item.value}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Healthcare Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive AI-powered tools for diabetes prediction and patient care management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {service.description}
                    </p>
                    <Link to={service.buttonLink}>
                      <Button className="w-full group-hover:scale-105 transition-transform">
                        {service.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Specialties */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Medical Specialties Coverage</h3>
            <p className="text-muted-foreground">In our platform we support multiple medical specialties</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {specialties.map((specialty, index) => {
              const IconComponent = specialty.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-medium text-sm">{specialty.name}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">We Partner Across The Whole Health System</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform serves diverse healthcare stakeholders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300 group">
                  <div className="mx-auto mb-6 p-4 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                  <p className="text-muted-foreground">{partner.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powered By Advanced Technology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our holistic approach combines behavior sciences, medicine, physical fitness, nutrition and social determinants of health with advanced data science to predict patient risk scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto p-6 rounded-full bg-primary/10 w-24 h-24 flex items-center justify-center">
                    <IconComponent className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">{feature.name}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
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
                <span className="font-bold text-lg">DiabetesPredict AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Advancing healthcare through AI-powered diabetes prediction and patient monitoring.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Risk Assessment</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Patient Monitoring</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Analytics Platform</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Request Demo</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DiabetesPredict AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;