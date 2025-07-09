import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Thermometer, 
  Heart, 
  Droplets, 
  Scale, 
  Pill,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  Clock
} from "lucide-react";

const Index = () => {
  // Sample health vitals data
  const healthVitals = [
    { 
      label: "Blood Sugar", 
      value: "76 mg/dl", 
      icon: Droplets, 
      status: "normal",
      color: "text-green-600" 
    },
    { 
      label: "HbA1c", 
      value: "6.7 mg/dl", 
      icon: Activity, 
      status: "elevated",
      color: "text-yellow-600" 
    },
    { 
      label: "Weight", 
      value: "67 KG", 
      icon: Scale, 
      status: "normal",
      color: "text-blue-600" 
    },
    { 
      label: "Body Mass Index(BMI)", 
      value: "27 kg/cm2", 
      icon: Scale, 
      status: "overweight",
      color: "text-orange-600" 
    },
    { 
      label: "Blood Pressure", 
      value: "Systolic 124, Diastolic 76", 
      icon: Heart, 
      status: "normal",
      color: "text-green-600" 
    },
    { 
      label: "Body Temperature", 
      value: "67°C", 
      icon: Thermometer, 
      status: "normal",
      color: "text-blue-600" 
    },
    { 
      label: "Pulse", 
      value: "90 BPM", 
      icon: Heart, 
      status: "normal",
      color: "text-green-600" 
    },
    { 
      label: "Glucose", 
      value: "67 mg/dl", 
      icon: Droplets, 
      status: "normal",
      color: "text-green-600" 
    }
  ];

  // Sample symptoms tracking data from previous visits
  const symptomsHistory = [
    {
      date: "2023-12-27",
      visit: "Today's Visit",
      symptoms: [
        { name: "Fatigue", severity: "Moderate", duration: "3 days" },
        { name: "Headache", severity: "Mild", duration: "1 day" },
        { name: "Joint Pain", severity: "Severe", duration: "1 week" }
      ],
      score: 13
    },
    {
      date: "2023-12-20",
      visit: "Last Visit",
      symptoms: [
        { name: "Dizziness", severity: "Mild", duration: "2 days" },
        { name: "Nausea", severity: "Moderate", duration: "1 day" },
        { name: "Back Pain", severity: "Mild", duration: "3 days" }
      ],
      score: 8
    },
    {
      date: "2023-12-13",
      visit: "Previous Visit",
      symptoms: [
        { name: "Chest Pain", severity: "Mild", duration: "1 day" },
        { name: "Shortness of Breath", severity: "Moderate", duration: "2 days" }
      ],
      score: 5
    },
    {
      date: "2023-12-06",
      visit: "Previous Visit",
      symptoms: [
        { name: "Fever", severity: "Moderate", duration: "2 days" },
        { name: "Cough", severity: "Severe", duration: "5 days" },
        { name: "Sore Throat", severity: "Mild", duration: "3 days" }
      ],
      score: 12
    },
    {
      date: "2023-11-29",
      visit: "Previous Visit",
      symptoms: [
        { name: "Muscle Aches", severity: "Moderate", duration: "4 days" },
        { name: "Fatigue", severity: "Severe", duration: "1 week" }
      ],
      score: 9
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "mild": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png" />
                <AvatarFallback>PH</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Patient: Pooja Shah</h1>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <span>Gender: Female</span>
                  <span>Age: 35</span>
                  <span>Height: 157</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold">Patient Dashboard</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Health Vitals */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Health Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthVitals.map((vital, index) => {
                    const IconComponent = vital.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                        <IconComponent className={`h-6 w-6 ${vital.color}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{vital.label}</p>
                          <p className="text-lg font-bold">{vital.value}</p>
                        </div>
                        <Badge 
                          variant={vital.status === 'normal' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {vital.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visit Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>Last Visit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">50</div>
                  <div className="text-sm text-muted-foreground">Score 0</div>
                  <Progress value={0} className="mt-4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Today's Visit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">December 27, 2023</div>
                  <div className="text-3xl font-bold">50</div>
                  <div className="text-sm text-muted-foreground">Score 13</div>
                  <div className="text-xs text-muted-foreground mt-1">Change in score: 0</div>
                  <Progress value={26} className="mt-4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Medication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Pill className="h-4 w-4" />
                  <span>No Medication</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground">
                  No Appointment
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Track My Symptoms */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Track My Symptoms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {symptomsHistory.map((visit, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{visit.visit}</h3>
                        <p className="text-sm text-muted-foreground">{visit.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Symptom Score</div>
                        <div className="text-xl font-bold">{visit.score}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Reported Symptoms:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {visit.symptoms.map((symptom, symptomIndex) => (
                          <div key={symptomIndex} className="border rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{symptom.name}</span>
                              <Badge 
                                variant="outline" 
                                className={getSeverityColor(symptom.severity)}
                              >
                                {symptom.severity}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Duration: {symptom.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {index === 0 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-md">
                        <div className="flex items-center text-sm text-blue-700">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <span>Current visit - symptoms being tracked</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;