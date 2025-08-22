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
import { useNavigate, useParams } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // Patient Information - Anonymized Case Study Patient
  const patientInfo = {
    name: "Patient #A-2024-001",
    gender: "Female",
    age: 35,
    height: 157,
    patientId: "22"
  };

  // Overall Risk Score
  const overallRisk = {
    percentage: 71,
    level: "High Risk",
    description: "High probability of developing Type 2 diabetes within 5 years despite normal current glucose levels"
  };

  // Risk Analysis Data - Based on Case Study
  const riskData = [
    {
      category: "Lifestyle Risk",
      percentage: 72,
      riskLevel: "High",
      description: "Poor sleep quality (82%), sedentary habits, high stress levels (78%), irregular meal patterns",
      contribution: "Primary driver of diabetes risk - lifestyle factors significantly increase metabolic strain",
      color: "bg-destructive",
      icon: Activity,
      details: [
        "Sleep Quality: 82% risk factor",
        "Stress Levels: 78% risk factor", 
        "Physical Activity: Sedentary lifestyle",
        "Meal Patterns: Irregular timing"
      ]
    },
    {
      category: "Clinical Markers",
      percentage: 15,
      riskLevel: "Low",
      description: "Normal fasting glucose (76 mg/dL), no active symptoms, no current medication required",
      contribution: "Current clinical status appears normal - early intervention window",
      color: "bg-green-500",
      icon: Heart,
      details: [
        "Fasting Glucose: 76 mg/dL (Normal)",
        "Active Symptoms: None reported",
        "Current Medication: None",
        "Physical Exam: Normal"
      ]
    },
    {
      category: "Historical Risk",
      percentage: 30,
      riskLevel: "Medium",
      description: "Elevated HbA1c (8.2%), strong family history of Type 2 diabetes, metabolic trends concerning",
      contribution: "Historical data indicates progressive metabolic dysfunction over time",
      color: "bg-yellow-500",
      icon: FileText,
      details: [
        "HbA1c: 8.2% (Elevated)",
        "Family History: Type 2 diabetes",
        "BMI Trend: Gradual increase",
        "Previous Labs: Borderline values"
      ]
    },
    {
      category: "SDOH Factors",
      percentage: 25,
      riskLevel: "Medium",
      description: "Poor air quality exposure, irregular meal patterns, environmental stressors affecting health",
      contribution: "Social determinants creating metabolic strain and limiting healthy behaviors",
      color: "bg-yellow-500",
      icon: MessageSquare,
      details: [
        "Air Quality: Poor exposure",
        "Meal Access: Irregular patterns",
        "Environmental Stress: Multiple factors",
        "Geographic Risk: Urban metabolic challenges"
      ]
    }
  ];

  // Health Vitals - Case Study Data
  const healthVitals = [
    { label: "Fasting Blood Sugar", value: "76 mg/dL", icon: Droplets, status: "normal", note: "Normal range despite high risk" },
    { label: "HbA1c", value: "8.2%", icon: Activity, status: "elevated", note: "Concerning historical trend" },
    { label: "Weight", value: "67 KG", icon: Weight, status: "normal", note: "Stable but trending upward" },
    { label: "Body Mass Index(BMI)", value: "27 kg/m²", icon: Ruler, status: "overweight", note: "Gradual increase over time" },
    { label: "Blood Pressure", value: "124/76 mmHg", icon: Heart, status: "normal", note: "Within normal limits" },
    { label: "Body Temperature", value: "98.6°F", icon: Thermometer, status: "normal", note: "Normal" },
    { label: "Pulse", value: "72 BPM", icon: Activity, status: "normal", note: "Resting heart rate normal" },
    { label: "Sleep Quality Score", value: "32/100", icon: Activity, status: "poor", note: "82% risk factor for diabetes" },
    { label: "Stress Level Score", value: "78/100", icon: Heart, status: "high", note: "78% risk contribution" },
    { label: "Physical Activity", value: "2 hrs/week", icon: Activity, status: "low", note: "Well below recommended 150 min/week" },
    { label: "Air Quality Exposure", value: "Poor AQI 150+", icon: Activity, status: "concerning", note: "Environmental SDOH factor" }
  ];

  // Visit Data - Case Study Timeline
  const visitData = {
    initialAssessment: {
      date: "March 15, 2024",
      score: 71,
      status: "High Risk"
    },
    currentStatus: {
      date: "August 22, 2024",
      score: 71,
      change: 0,
      status: "High Risk - Intervention Started"
    },
    projectedOutcome: {
      date: "3-6 Months Post-Intervention",
      projectedScore: 45,
      expectedChange: -26,
      status: "Projected: Medium Risk"
    }
  };

  // Health Goals
  const healthGoals = [
    "Reduce Weight",
    "Increase Physical Activity",
    "Improve Sleep Quality",
    "Monitor Blood Sugar Levels"
  ];

  // AI-Generated Personalized Recommendations
  const recommendations = [
    "Initiate Metformin therapy (500 mg BID) - Preventive medication",
    "Enroll in stress management program (yoga + mindfulness)",
    "Implement structured Mediterranean diet with meal timing",
    "Exercise routine: 150 minutes per week structured program",
    "Install continuous glucose monitoring (CGM) system",
    "Schedule quarterly HbA1c monitoring tests"
  ];

  // Preventive Care Implementation Plan
  const preventiveCare = [
    "Week 1-2: Begin Metformin 500mg twice daily with meals",
    "Week 2-4: Start stress management program enrollment",
    "Month 1: Implement Mediterranean diet with nutrition counseling", 
    "Month 1: Begin supervised exercise program 150 min/week",
    "Month 1: Install CGM and train on monitoring",
    "Month 3: First follow-up HbA1c and progress assessment"
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
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/patient/${id}/history`)}
                >
                  View Patient History
                </Button>
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
                {/* Initial Assessment */}
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Initial Assessment</h3>
                  <p className="text-sm text-muted-foreground mb-4">{visitData.initialAssessment.date}</p>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="48" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="48" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="8"
                        strokeDasharray={`${(visitData.initialAssessment.score / 100) * 301.6} 301.6`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{visitData.initialAssessment.score}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Risk Score: {visitData.initialAssessment.score}%</p>
                  <Badge variant="destructive" className="text-xs mt-1">{visitData.initialAssessment.status}</Badge>
                </div>

                {/* Current Status */}
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  <p className="text-sm text-muted-foreground mb-4">{visitData.currentStatus.date}</p>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="48" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="48" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="8"
                        strokeDasharray={`${(visitData.currentStatus.score / 100) * 301.6} 301.6`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{visitData.currentStatus.score}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Risk Score: {visitData.currentStatus.score}%</p>
                  <Badge variant="destructive" className="text-xs mt-1">{visitData.currentStatus.status}</Badge>
                </div>
              </div>

              {/* Projected Outcome */}
              <div className="mb-8 text-center">
                <h3 className="font-semibold mb-2">Projected Outcome</h3>
                <p className="text-sm text-muted-foreground mb-4">{visitData.projectedOutcome.date}</p>
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
                      strokeDasharray={`${(visitData.projectedOutcome.projectedScore / 100) * 301.6} 301.6`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{visitData.projectedOutcome.projectedScore}</span>
                  </div>
                </div>
                <p className="text-sm font-medium">Projected Risk: {visitData.projectedOutcome.projectedScore}%</p>
                <p className="text-sm text-muted-foreground">Expected change: {visitData.projectedOutcome.expectedChange}%</p>
                <Badge variant="default" className="text-xs mt-1">{visitData.projectedOutcome.status}</Badge>
              </div>

              {/* Next Steps and Medication */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Intervention Status: Active</span>
                    <Button 
                      size="sm" 
                      className="bg-primary"
                      onClick={() => navigate(`/patient/${id}/examination`)}
                    >
                      Start Examination
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Active Medication</h4>
                  <p className="text-sm text-muted-foreground">Metformin 500mg BID (Preventive)</p>
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