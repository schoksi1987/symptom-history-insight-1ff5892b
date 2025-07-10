import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Bell,
  Calendar,
  FileText,
  MessageSquare,
  Share,
  Activity,
  Thermometer,
  Heart,
  Droplets,
  Weight,
  Ruler,
  Gauge,
  TrendingUp,
  Edit,
  Plus
} from "lucide-react";

const PatientDashboard = () => {
  // Patient Information
  const patientInfo = {
    name: "Pooja Shah",
    gender: "Female",
    age: 35,
    height: 157,
    patientId: "22"
  };

  // Risk Analysis Data
  const riskData = [
    {
      category: "Lifestyle",
      percentage: 72,
      riskLevel: "High",
      description: "Poor diet, sedentary lifestyle, irregular sleep patterns affecting metabolic health",
      contribution: "10% of lifestyle risk score contributes to overall risk prediction",
      color: "bg-destructive",
      icon: Activity
    },
    {
      category: "Signs & Symptoms",
      percentage: 15,
      riskLevel: "Low",
      description: "Mild fatigue, occasional increased thirst, no significant symptoms reported",
      contribution: "10% of lifestyle risk score contributes to overall risk prediction",
      color: "bg-green-500",
      icon: Heart
    },
    {
      category: "Historical Medical Data",
      percentage: 30,
      riskLevel: "Medium",
      description: "Family history of Type 2 diabetes, previous gestational diabetes, BMI trending upward",
      contribution: "10% of lifestyle risk score contributes to overall risk prediction",
      color: "bg-yellow-500",
      icon: FileText
    },
    {
      category: "Social Media",
      percentage: 2,
      riskLevel: "Low",
      description: "Limited social media activity, no health-related discussions or patterns identified",
      contribution: "10% of lifestyle risk score contributes to overall risk prediction",
      color: "bg-green-500",
      icon: MessageSquare
    }
  ];

  // Health Vitals
  const healthVitals = [
    { label: "Blood Sugar", value: "76 mg/dl", icon: Droplets, status: "normal" },
    { label: "HbA1c", value: "6.7 mg/dl", icon: Activity, status: "borderline" },
    { label: "Weight", value: "67 KG", icon: Weight, status: "normal" },
    { label: "Body Mass Index(BMI)", value: "27 kg/cm2", icon: Ruler, status: "overweight" },
    { label: "Blood Pressure", value: "Systolic 124, Diastolic 76", icon: Heart, status: "normal" },
    { label: "Body Temperature", value: "67°C", icon: Thermometer, status: "normal" },
    { label: "Pulse", value: "90 BPM", icon: Activity, status: "normal" },
    { label: "Glucose", value: "67 mg/dl", icon: Droplets, status: "normal" },
    { label: "Cholesterol (mg/dl)", value: "Total 128, HDL 76, LDL 66, VLDL 77", icon: Activity, status: "borderline" },
    { label: "Triglycerides", value: "66 mg/dl", icon: Droplets, status: "normal" },
    { label: "Waist Circumference", value: "35 CM", icon: Ruler, status: "normal" }
  ];

  // Visit Data
  const visitData = {
    lastVisit: {
      date: "December 27, 2023",
      score: 13,
      status: "Low Risk"
    },
    todayVisit: {
      date: "July 10, 2025",
      score: 29,
      change: 16,
      status: "Medium Risk"
    }
  };

  // Health Goals
  const healthGoals = [
    "Reduce Weight",
    "Increase Physical Activity",
    "Improve Sleep Quality",
    "Monitor Blood Sugar Levels"
  ];

  // Recommendations
  const recommendations = [
    "Follow Mediterranean diet pattern",
    "Exercise 150 minutes per week",
    "Monitor blood glucose weekly",
    "Maintain healthy sleep schedule"
  ];

  // Preventive Care Steps
  const preventiveCare = [
    "Run for 30 minutes for 6 months",
    "Reduce sugar intake by 50%",
    "Schedule quarterly HbA1c tests",
    "Join diabetes prevention program"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold">Predict Disease</h1>
                <Badge variant="secondary" className="text-xs">Beta</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png" />
                  <AvatarFallback>DJ</AvatarFallback>
                </Avatar>
                <span className="text-sm">Dr. John</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Patient Info Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                <span><strong>Patient:</strong> {patientInfo.name}</span>
                <span><strong>Gender:</strong> {patientInfo.gender}</span>
                <span><strong>Age:</strong> {patientInfo.age}</span>
                <span><strong>Height:</strong> {patientInfo.height}</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="outline">Set a Reminder</Button>
                <Button size="sm" variant="outline">Patient Documents</Button>
                <Button size="sm" variant="outline">Patient Communication</Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground">Reserve Next Appointment</Button>
                <Button size="sm" variant="outline">Share Dashboard with patient</Button>
              </div>
            </div>
            <h2 className="text-lg font-semibold">Patient Dashboard</h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Risk Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {riskData.map((risk, index) => {
            const IconComponent = risk.icon;
            return (
              <Card key={index} className="relative">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm">
                    <IconComponent className="h-4 w-4 mr-2" />
                    {risk.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {risk.description}
                  </p>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-muted-foreground mb-1">
                      {risk.percentage}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {risk.contribution}
                    </p>
                  </div>
                  <div className={`${risk.color} text-white text-center py-2 rounded text-sm font-medium`}>
                    {risk.riskLevel}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Goals, Recommendations, and Preventive Care */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Health Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {healthGoals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{goal}</span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3 text-blue-500" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3 text-blue-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {rec}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Steps for Preventive Care</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {preventiveCare.map((step, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{step}</span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3 text-blue-500" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3 text-blue-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Vitals */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Health Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthVitals.map((vital, index) => {
                  const IconComponent = vital.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded ${
                        vital.status === 'normal' ? 'bg-green-100 text-green-600' :
                        vital.status === 'borderline' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{vital.label}</div>
                        <div className="text-sm text-muted-foreground">{vital.value}</div>
                      </div>
                      {vital.label === "Body Temperature" && (
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Visit Comparison and Medication */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Last Visit */}
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Last Visit</h3>
                  <p className="text-sm text-muted-foreground mb-4">{visitData.lastVisit.date}</p>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="48" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="48" 
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="8"
                        strokeDasharray={`${(visitData.lastVisit.score / 100) * 301.6} 301.6`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{visitData.lastVisit.score}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Score {visitData.lastVisit.score}</p>
                </div>

                {/* Today Visit */}
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Today Visit</h3>
                  <p className="text-sm text-muted-foreground mb-4">{visitData.todayVisit.date}</p>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="48" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="48" 
                        fill="none" 
                        stroke="#eab308" 
                        strokeWidth="8"
                        strokeDasharray={`${(visitData.todayVisit.score / 100) * 301.6} 301.6`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{visitData.todayVisit.score}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Score {visitData.todayVisit.score}</p>
                  <p className="text-sm text-muted-foreground">Change in score: {visitData.todayVisit.change}</p>
                </div>
              </div>

              {/* Next Visit and Medication */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Next Visit: July 10, 2025</span>
                    <Button size="sm" className="bg-primary">Recommendation</Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Active Medication</h4>
                  <p className="text-sm text-muted-foreground">No Medication</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Track My Symptoms */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Track My Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 border-2 border-dashed border-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No symptoms tracked yet</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Notice */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-foreground text-background px-6 py-2 rounded">
            Your current subscription is valid till December 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;