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
  TrendingDown,
  TrendingUp,
  Activity,
  Heart,
  Droplets,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Stethoscope,
  Pill,
  Utensils,
  Moon
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PatientHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Patient Information - Anonymized
  const patientInfo = {
    name: "Patient #A-2024-001",
    gender: "Female", 
    age: 35,
    patientId: "22"
  };

  // Timeline Data - Case Study Journey
  const timelineEvents = [
    {
      date: "March 15, 2024",
      title: "Initial Assessment",
      type: "assessment",
      status: "completed",
      riskScore: 71,
      details: [
        "Comprehensive AI-powered risk assessment completed",
        "Integrated clinical, behavioral, family history data",
        "Geographic and SDOH factors analyzed",
        "High-risk (71%) flagged despite normal glucose"
      ],
      clinicalData: {
        fastingGlucose: "76 mg/dL (Normal)",
        hba1c: "8.2% (Elevated)", 
        bmi: "27 kg/m²",
        bloodPressure: "124/76 mmHg"
      }
    },
    {
      date: "March 20, 2024",
      title: "Risk Factor Analysis",
      type: "analysis", 
      status: "completed",
      details: [
        "Lifestyle risk: 72% - Poor sleep quality, sedentary habits, high stress",
        "Historical risk: 30% - Elevated HbA1c, family history of diabetes",
        "SDOH stressors: Poor air quality, irregular meal patterns", 
        "Critical indicators: Stress (78%), Sleep quality (82%)"
      ],
      breakdown: {
        lifestyle: 72,
        clinical: 15,
        historical: 30,
        sdoh: 25
      }
    },
    {
      date: "March 25, 2024", 
      title: "Personalized Prevention Plan Generated",
      type: "treatment",
      status: "completed",
      details: [
        "AI automatically generated comprehensive intervention plan",
        "Metformin therapy initiated (500 mg BID)",
        "Stress management program enrollment (yoga + mindfulness)",
        "Mediterranean diet and exercise routine (150 min/week)",
        "Continuous glucose monitoring setup",
        "Quarterly HbA1c monitoring scheduled"
      ]
    },
    {
      date: "April 1, 2024",
      title: "Intervention Implementation",
      type: "intervention",
      status: "completed", 
      riskScore: 68,
      details: [
        "Metformin therapy started - 500mg twice daily",
        "Enrolled in 12-week stress management program",
        "Nutrition counseling for Mediterranean diet implementation",
        "CGM device installed and patient trained",
        "Baseline measurements recorded for tracking"
      ],
      improvements: [
        "Medication adherence: 95%",
        "Stress program attendance: 100%",
        "Diet compliance: 80%",
        "Exercise compliance: 70%"
      ]
    },
    {
      date: "June 1, 2024",
      title: "8-Week Progress Review",
      type: "followup",
      status: "completed",
      riskScore: 58,
      details: [
        "Significant improvement in lifestyle factors",
        "Sleep quality improved from 32/100 to 65/100", 
        "Stress levels decreased from 78/100 to 52/100",
        "Weight loss: 3.2 kg, BMI reduced to 25.1",
        "Exercise compliance increased to 90%"
      ],
      clinicalData: {
        fastingGlucose: "74 mg/dL",
        hba1c: "7.8%",
        bmi: "25.1 kg/m²", 
        bloodPressure: "118/72 mmHg"
      }
    },
    {
      date: "August 22, 2024",
      title: "Current Status",
      type: "current",
      status: "ongoing",
      riskScore: 45,
      details: [
        "Sustained improvement across all metrics",
        "Risk reduced from 71% to 45% (36% reduction)",
        "No progression to Type 2 diabetes",
        "Lifestyle modifications well-established",
        "Continued monitoring and optimization"
      ],
      clinicalData: {
        fastingGlucose: "72 mg/dL",
        hba1c: "7.1%",
        bmi: "24.8 kg/m²",
        bloodPressure: "115/70 mmHg"
      }
    },
    {
      date: "December 2024",
      title: "Projected 6-Month Outcome",
      type: "projection",
      status: "projected",
      riskScore: 28,
      details: [
        "Projected risk reduction to 28% (60% total reduction)",
        "Expected HbA1c normalization to <7.0%",
        "Sustained weight management and lifestyle changes",
        "Reduced medication dependence potential",
        "Long-term diabetes prevention achieved"
      ],
      projectedData: {
        fastingGlucose: "68-75 mg/dL",
        hba1c: "6.8-7.0%",
        bmi: "23.5-24.5 kg/m²",
        riskReduction: "60%"
      }
    }
  ];

  // Intervention Tracking
  const interventionTracking = [
    {
      intervention: "Metformin Therapy",
      icon: Pill,
      status: "Active",
      adherence: 95,
      notes: "500mg BID - Excellent compliance, no side effects"
    },
    {
      intervention: "Stress Management Program", 
      icon: Heart,
      status: "Completed",
      adherence: 100,
      notes: "12-week program completed - Stress reduced from 78% to 45%"
    },
    {
      intervention: "Mediterranean Diet",
      icon: Utensils,
      status: "Active", 
      adherence: 90,
      notes: "Excellent dietary compliance - Weight loss of 5.2kg achieved"
    },
    {
      intervention: "Exercise Program",
      icon: Activity,
      status: "Active",
      adherence: 90, 
      notes: "150 min/week target achieved - Cardiovascular fitness improved"
    },
    {
      intervention: "Sleep Quality Improvement",
      icon: Moon,
      status: "Active",
      adherence: 85,
      notes: "Sleep quality improved from 32/100 to 75/100"
    },
    {
      intervention: "Continuous Glucose Monitoring",
      icon: Droplets,
      status: "Active",
      adherence: 98,
      notes: "Excellent glucose pattern awareness - Early detection capability"
    }
  ];

  // Risk Score Progression
  const riskProgression = [
    { month: "Baseline", score: 71, status: "High Risk" },
    { month: "Month 1", score: 68, status: "High Risk" },
    { month: "Month 2", score: 58, status: "Medium Risk" },
    { month: "Month 5", score: 45, status: "Medium Risk" },
    { month: "Projected 6m", score: 28, status: "Low-Medium Risk" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'ongoing': return 'bg-blue-500';
      case 'projected': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment': return Stethoscope;
      case 'analysis': return FileText;
      case 'treatment': return Pill;
      case 'intervention': return Target;
      case 'followup': return CheckCircle;
      case 'current': return Clock;
      case 'projection': return TrendingUp;
      default: return Calendar;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => navigate(`/patient/${id}`)}
              >
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
              </div>
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="outline" onClick={() => navigate(`/patient/${id}`)}>
                  Back to Dashboard
                </Button>
                <Button size="sm" variant="outline">Export History Report</Button>
                <Button size="sm" variant="outline">Share with Patient</Button>
              </div>
            </div>
            <h2 className="text-lg font-semibold">Patient History & Progress Tracking</h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Risk Score Progression Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="h-5 w-5 mr-2 text-green-600" />
              Risk Score Progression - 60% Reduction Achieved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {riskProgression.map((point, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="36" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="36" 
                        fill="none" 
                        stroke={point.score > 60 ? "#ef4444" : point.score > 30 ? "#eab308" : "#22c55e"}
                        strokeWidth="6"
                        strokeDasharray={`${(point.score / 100) * 226} 226`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{point.score}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{point.month}</div>
                  <Badge 
                    variant={point.score > 60 ? "destructive" : point.score > 30 ? "secondary" : "default"}
                    className="text-xs mt-1"
                  >
                    {point.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Journey Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timelineEvents.map((event, index) => {
                    const IconComponent = getTypeIcon(event.type);
                    return (
                      <div key={index} className="relative">
                        {index < timelineEvents.length - 1 && (
                          <div className="absolute left-6 top-12 h-16 w-0.5 bg-border"></div>
                        )}
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-full ${getStatusColor(event.status)} text-white flex-shrink-0`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{event.title}</h4>
                              <div className="flex items-center space-x-2">
                                {event.riskScore && (
                                  <Badge variant="outline">Risk: {event.riskScore}%</Badge>
                                )}
                                <span className="text-sm text-muted-foreground">{event.date}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {event.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="text-sm text-muted-foreground">
                                  • {detail}
                                </div>
                              ))}
                            </div>
                            {event.clinicalData && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                <h5 className="text-sm font-medium mb-2">Clinical Data:</h5>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {Object.entries(event.clinicalData).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                      <span className="font-medium">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {event.improvements && (
                              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                <h5 className="text-sm font-medium mb-2 text-green-800">Compliance Tracking:</h5>
                                {event.improvements.map((improvement, impIndex) => (
                                  <div key={impIndex} className="text-sm text-green-700">
                                    • {improvement}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Intervention Tracking */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Active Interventions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interventionTracking.map((intervention, index) => {
                    const IconComponent = intervention.icon;
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="font-medium text-sm">{intervention.intervention}</span>
                          </div>
                          <Badge 
                            variant={intervention.status === 'Active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {intervention.status}
                          </Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Adherence</span>
                            <span>{intervention.adherence}%</span>
                          </div>
                          <Progress value={intervention.adherence} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground">{intervention.notes}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">60% Risk Reduction Achieved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">No Progression to Type 2 Diabetes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">HbA1c Improved from 8.2% to 7.1%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Weight Loss: 5.2kg Achieved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Lifestyle Changes Sustained</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Continued Monitoring Required</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Story Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-green-600">Prevention Success Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-sm text-green-800 leading-relaxed">
                <strong>Early Detection Impact:</strong> This case demonstrates the power of AI-driven early intervention. 
                Despite normal fasting glucose levels, our comprehensive risk assessment identified a 71% probability of 
                developing Type 2 diabetes within 5 years. Through personalized intervention combining medication, 
                lifestyle changes, and continuous monitoring, we achieved a 60% risk reduction in just 5 months. 
                <strong> Without this tool, this patient likely would have gone undiagnosed until irreversible 
                metabolic damage occurred.</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientHistory;