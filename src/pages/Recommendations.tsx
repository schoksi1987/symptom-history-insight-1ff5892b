import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Clock, 
  Network, 
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

const Recommendations = () => {
  // Risk factors data
  const riskFactors = [
    {
      title: "Lifestyle",
      percentage: 72,
      icon: TrendingUp,
      level: "HIGH",
      color: "bg-red-500",
      textColor: "text-red-600"
    },
    {
      title: "Social Insights",
      percentage: 15,
      icon: Users,
      level: "LOW",
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Historical Medical Data",
      percentage: 30,
      icon: Clock,
      level: "MEDIUM",
      color: "bg-yellow-500",
      textColor: "text-yellow-600"
    },
    {
      title: "Family History",
      percentage: 2,
      icon: Network,
      level: "LOW",
      color: "bg-green-500",
      textColor: "text-green-600"
    }
  ];

  // Lifestyle assessment data
  const lifestyleFactors = [
    { factor: "Digestive", score: 85, color: "bg-teal-500" },
    { factor: "Stress", score: 70, color: "bg-teal-500" },
    { factor: "Living Conditions", score: 60, color: "bg-teal-500" },
    { factor: "Activity", score: 45, color: "bg-teal-500" },
    { factor: "Sleep", score: 65, color: "bg-teal-500" }
  ];

  // Social insights data
  const socialInsights = [
    {
      name: "Hunter918",
      age: "45-54",
      matchedSymptoms: "Frequent Urination",
      unmatchedSymptoms: "Abdominal Pain",
      riskScore: 34
    },
    {
      name: "Chanelle",
      age: "25-34",
      matchedSymptoms: "Frequent Urination",
      unmatchedSymptoms: "Increased Thirst, Blurred Vision, Weight Loss",
      riskScore: 20
    }
  ];

  // Symptom score data
  const symptomScore = {
    symptom: "Frequent urination",
    score: 15,
    riskLevel: "Low"
  };

  // Possible symptoms
  const possibleSymptoms = [
    "Vaginal Pain",
    "Increased Susceptibility To Infection"
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskLevelTextColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
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
              <h2 className="text-lg font-semibold">Recommendations and Insights</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Risk Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {riskFactors.map((factor, index) => {
            const IconComponent = factor.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <IconComponent className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">{factor.title}</h3>
                  <div className="text-3xl font-bold mb-2">{factor.percentage}%</div>
                  <Badge className={`${getRiskLevelColor(factor.level)} text-white`}>
                    {factor.level}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lifestyle Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle Assessment</CardTitle>
                <p className="text-sm text-muted-foreground">Design strategy for below prioritized areas</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lifestyleFactors.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.factor}</span>
                      <div className="flex-1 mx-4">
                        <Progress value={item.score} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">{item.score}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Social insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Age</th>
                        <th className="text-left py-2">Matched Symptoms</th>
                        <th className="text-left py-2">Unmatched Symptoms</th>
                        <th className="text-left py-2">Risk Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {socialInsights.map((patient, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">{patient.name}</td>
                          <td className="py-3">{patient.age}</td>
                          <td className="py-3">{patient.matchedSymptoms}</td>
                          <td className="py-3">{patient.unmatchedSymptoms}</td>
                          <td className="py-3">{patient.riskScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personalized Facts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>BMI of 28.5 indicates overweight status</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>Family history: Mother diagnosed at age 52</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>Sedentary job with minimal physical activity</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>Irregular meal patterns affecting glucose levels</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Possible Symptoms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you noticed any of those symptoms, please contact your doctor
                  </p>
                  <div className="space-y-2">
                    {possibleSymptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{symptom}</span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Lose 5kg in next 6 months</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">○</span>
                      <span>Exercise 30min daily</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">○</span>
                      <span>Reduce refined sugar intake</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">○</span>
                      <span>Monitor blood glucose monthly</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preventive Measures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-blue-50 rounded text-blue-800">
                      <strong>Diet:</strong> Mediterranean diet with reduced carbs
                    </div>
                    <div className="p-2 bg-green-50 rounded text-green-800">
                      <strong>Exercise:</strong> 150min moderate activity/week
                    </div>
                    <div className="p-2 bg-purple-50 rounded text-purple-800">
                      <strong>Monitoring:</strong> HbA1c every 3 months
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-orange-800">
                      <strong>Lifestyle:</strong> Stress management & quality sleep
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Overall Risk Score */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${71 * 3.52} 351.86`}
                        className="text-teal-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">71%</div>
                        <div className="text-xs text-muted-foreground">29%</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="text-lg font-semibold text-yellow-600">MEDIUM RISK</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Symptom Score */}
            <Card>
              <CardHeader>
                <CardTitle>Symptom Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Symptom</span>
                    <span className="text-sm font-medium">Score</span>
                    <span className="text-sm font-medium">Risk Level</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{symptomScore.symptom}</span>
                    <span className="text-sm font-bold">{symptomScore.score}</span>
                    <Badge variant="outline" className={getRiskLevelTextColor(symptomScore.riskLevel)}>
                      {symptomScore.riskLevel}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;