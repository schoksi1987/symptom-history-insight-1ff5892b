import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Clock, 
  Network, 
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Heart,
  Activity,
  Brain,
  Home,
  Bed,
  Target,
  Calendar,
  MapPin,
  ArrowLeft,
  FileText,
  Stethoscope,
  Dna,
  BarChart
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Recommendations = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Comprehensive risk factors based on all assessments
  const riskFactors = [
    {
      title: "Lifestyle",
      percentage: 72,
      icon: Activity,
      level: "HIGH",
      color: "bg-red-500",
      details: "Poor sleep quality (82%), high stress (78%), limited activity (70%)"
    },
    {
      title: "Social Insights",
      percentage: 15,
      icon: Users,
      level: "LOW",
      color: "bg-green-500",
      details: "Stable housing, employment security, social support available"
    },
    {
      title: "Historical Medical Data",
      percentage: 30,
      icon: Clock,
      level: "MEDIUM",
      color: "bg-yellow-500",
      details: "Elevated HbA1c (8.2%), BMI 28.4, irregular glucose patterns"
    },
    {
      title: "Family History",
      percentage: 45,
      icon: Network,
      level: "MEDIUM",
      color: "bg-orange-500",
      details: "Father diagnosed at 45, grandfather with diabetes, similar symptom patterns"
    }
  ];

  // Enhanced lifestyle assessment with SDOH data
  const lifestyleFactors = [
    { factor: "Digestive", score: 65, color: "bg-orange-500", priority: "High", intervention: "Meal timing regulation, portion control" },
    { factor: "Stress", score: 78, color: "bg-red-500", priority: "Critical", intervention: "Stress management therapy, mindfulness training" },
    { factor: "Living Conditions", score: 45, color: "bg-yellow-500", priority: "Medium", intervention: "Environmental modifications, air quality improvement" },
    { factor: "Activity", score: 70, color: "bg-red-500", priority: "High", intervention: "Structured exercise program, workplace ergonomics" },
    { factor: "Sleep", score: 82, color: "bg-red-500", priority: "Critical", intervention: "Sleep hygiene counseling, environment optimization" }
  ];

  // Social insights from similar patient journeys
  const socialInsights = [
    {
      name: "Hunter918",
      age: "45-54",
      matchedSymptoms: "Frequent Urination, Fatigue, Family History",
      unmatchedSymptoms: "Abdominal Pain",
      riskScore: 34,
      outcome: "Successful management with lifestyle changes",
      intervention: "Mediterranean diet + 150min/week exercise"
    },
    {
      name: "Chanelle",
      age: "25-34",
      matchedSymptoms: "Frequent Urination, Stress, Work-Life Balance",
      unmatchedSymptoms: "Increased Thirst, Blurred Vision, Weight Loss",
      riskScore: 20,
      outcome: "Prediabetes reversed in 8 months",
      intervention: "HIIT training + intermittent fasting"
    },
    {
      name: "Sarah_M",
      age: "35-44",
      matchedSymptoms: "Sleep Issues, Family History, Stress Eating",
      unmatchedSymptoms: "Joint Pain",
      riskScore: 28,
      outcome: "HbA1c reduced from 8.1 to 6.2",
      intervention: "Sleep therapy + nutritional counseling"
    }
  ];

  // Physician examination findings
  const physicianFindings = {
    overallAssessment: "Patient presents with multiple diabetes risk factors requiring immediate intervention",
    keyFindings: [
      "Elevated HbA1c (8.2%) indicating poor glycemic control",
      "BMI 28.4 - overweight category with central adiposity",
      "Blood pressure 142/88 - stage 1 hypertension",
      "Lipid panel shows dyslipidemia pattern",
      "Family history strongly positive for T2DM"
    ],
    bodySystemFindings: [
      { system: "Cardiovascular", finding: "Mild hypertension, no murmurs", risk: "Medium" },
      { system: "Endocrine", finding: "Insulin resistance markers present", risk: "High" },
      { system: "Nervous System", finding: "Early peripheral neuropathy signs", risk: "Medium" },
      { system: "Eyes", finding: "No diabetic retinopathy detected", risk: "Low" }
    ]
  };

  // Comprehensive symptom analysis
  const symptomAnalysis = [
    { symptom: "Frequent urination", score: 15, riskLevel: "Low", frequency: "8-10 times daily", nlpConfidence: "95%" },
    { symptom: "Increased thirst", score: 12, riskLevel: "Low", frequency: "Throughout day", nlpConfidence: "92%" },
    { symptom: "Fatigue", score: 18, riskLevel: "Medium", frequency: "Post-meal", nlpConfidence: "88%" },
    { symptom: "Blurred vision", score: 10, riskLevel: "Low", frequency: "Occasional", nlpConfidence: "85%" },
    { symptom: "Tingling in feet", score: 14, riskLevel: "Medium", frequency: "Evening hours", nlpConfidence: "90%" }
  ];

  // Personalized recommendations based on all data
  const personalizedFacts = [
    "BMI of 28.4 puts you in overweight category - 5kg weight loss would significantly reduce diabetes risk",
    "Father's diabetes diagnosis at 45 with similar symptoms increases your genetic risk by 40%",
    "Current stress levels (78% risk score) are contributing to elevated cortisol and insulin resistance",
    "Sleep quality issues (82% risk) are affecting glucose metabolism and hormone regulation",
    "Geographic area (Springfield, MO) has 12.8% diabetes prevalence - higher than national average",
    "Work environment (sedentary) combined with irregular meals creates metabolic stress",
    "Mental health indicators suggest need for stress management and emotional support"
  ];

  // Evidence-based goals with timelines
  const treatmentGoals = [
    { goal: "Reduce HbA1c to <7.0%", timeline: "3-6 months", status: "In Progress", priority: "Critical" },
    { goal: "Lose 5kg (to BMI <25)", timeline: "6 months", status: "Not Started", priority: "High" },
    { goal: "Exercise 150min/week", timeline: "4 weeks", status: "Planning", priority: "High" },
    { goal: "Reduce stress score <50%", timeline: "8 weeks", status: "Not Started", priority: "High" },
    { goal: "Improve sleep quality", timeline: "6 weeks", status: "Not Started", priority: "Medium" },
    { goal: "BP control <130/80", timeline: "12 weeks", status: "Monitoring", priority: "Medium" }
  ];

  // Comprehensive preventive measures
  const preventiveMeasures = [
    {
      category: "Immediate Actions (1-2 weeks)",
      measures: [
        "Start continuous glucose monitoring",
        "Begin metformin therapy (500mg twice daily)",
        "Schedule dietitian consultation",
        "Implement sleep hygiene protocol"
      ],
      color: "bg-red-50 text-red-800"
    },
    {
      category: "Short-term (1-3 months)",
      measures: [
        "Mediterranean diet implementation",
        "Progressive exercise program (start 75min/week)",
        "Stress management techniques (mindfulness, yoga)",
        "Monthly HbA1c monitoring"
      ],
      color: "bg-orange-50 text-orange-800"
    },
    {
      category: "Long-term (3-12 months)",
      measures: [
        "Maintain target weight (BMI 22-25)",
        "150+ minutes weekly exercise routine",
        "Quarterly comprehensive metabolic panels",
        "Annual diabetic complications screening"
      ],
      color: "bg-green-50 text-green-800"
    }
  ];

  const [editMode, setEditMode] = useState({});
  const [newItem, setNewItem] = useState({ type: '', content: '' });

  const getRiskLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-red-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high": return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case "medium": return <Target className="h-4 w-4 text-yellow-600" />;
      default: return <Target className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/patient/${id}/sdoh`)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-16 w-16">
                <AvatarImage src="/lovable-uploads/b851c275-b12a-4121-9e3f-1f76d80b4d1f.png" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Patient: Pooja Shah</h1>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <span>Gender: Female</span>
                  <span>Age: 35</span>
                  <span>Height: 157cm</span>
                  <span>BMI: 28.4</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold">Comprehensive Recommendations & Insights</h2>
              <p className="text-sm text-muted-foreground">
                Based on clinical examination, family history, lifestyle assessment & social determinants
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Risk Factors Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {riskFactors.map((factor, index) => {
            const IconComponent = factor.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <Badge className={factor.color}>{factor.level}</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{factor.title}</h3>
                  <div className="text-3xl font-bold mb-2">{factor.percentage}%</div>
                  <p className="text-xs text-muted-foreground">{factor.details}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* SDOH Lifestyle Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  SDOH Lifestyle Assessment
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Prioritized intervention areas based on social determinants of health
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lifestyleFactors.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(item.priority)}
                          <span className="font-medium">{item.factor}</span>
                          <Badge variant="outline" className={getRiskLevelColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                        <span className="text-lg font-bold">{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        <strong>Intervention:</strong> {item.intervention}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Insights & Similar Patient Journeys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Social Insights & Similar Patient Journeys
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Learning from patients with similar profiles and outcomes
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialInsights.map((patient, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-blue-50/50">
                      <div className="grid grid-cols-6 gap-4 text-sm">
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-muted-foreground">{patient.age}</div>
                        </div>
                        <div>
                          <div className="text-green-700 font-medium">Matched</div>
                          <div>{patient.matchedSymptoms}</div>
                        </div>
                        <div>
                          <div className="text-orange-700 font-medium">Different</div>
                          <div>{patient.unmatchedSymptoms}</div>
                        </div>
                        <div>
                          <div className="font-medium">Risk: {patient.riskScore}</div>
                        </div>
                        <div>
                          <div className="text-green-800 font-medium">Outcome</div>
                          <div>{patient.outcome}</div>
                        </div>
                        <div>
                          <div className="text-primary font-medium">Strategy</div>
                          <div>{patient.intervention}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Physician Examination Findings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Physician Examination Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Overall Clinical Assessment</h4>
                    <p className="text-sm">{physicianFindings.overallAssessment}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Key Clinical Findings</h4>
                    <div className="space-y-2">
                      {physicianFindings.keyFindings.map((finding, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Body System Review</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {physicianFindings.bodySystemFindings.map((system, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{system.system}</span>
                            <Badge variant="outline" className={getRiskLevelColor(system.risk)}>
                              {system.risk}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{system.finding}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive Treatment Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Evidence-Based Treatment Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {treatmentGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getPriorityIcon(goal.priority)}
                          <span className="font-medium">{goal.goal}</span>
                          <Badge variant="outline" className={getRiskLevelColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Timeline: {goal.timeline} • Status: {goal.status}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Overall Risk Score */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Risk Score</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Composite risk based on all assessments
                </p>
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
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">71%</div>
                        <div className="text-xs text-muted-foreground">Risk Score</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className="text-lg font-semibold text-orange-600">HIGH RISK</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Immediate intervention recommended
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Symptom Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Symptom Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  NLP-analyzed symptoms with risk scoring
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {symptomAnalysis.map((symptom, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{symptom.symptom}</span>
                        <Badge variant="outline" className={getRiskLevelColor(symptom.riskLevel)}>
                          {symptom.riskLevel}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Score: {symptom.score}</div>
                        <div>Frequency: {symptom.frequency}</div>
                        <div>AI Confidence: {symptom.nlpConfidence}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personalized Facts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Personalized Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {personalizedFacts.map((fact, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive Preventive Measures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Preventive Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {preventiveMeasures.map((category, index) => (
                    <div key={index} className={`p-3 rounded-lg ${category.color}`}>
                      <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                      <ul className="space-y-1">
                        {category.measures.map((measure, measureIndex) => (
                          <li key={measureIndex} className="text-xs flex items-start gap-1">
                            <span className="mt-1">•</span>
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button 
            variant="outline"
            onClick={() => navigate(`/patient/${id}/sdoh`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment
          </Button>
          
          <div className="flex gap-4">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;