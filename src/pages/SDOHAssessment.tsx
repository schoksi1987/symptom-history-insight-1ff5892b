import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Heart, Activity, Home, Brain, Bed, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SDOHAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [responses, setResponses] = useState({
    // Digestive Health
    eatingSchedule: "irregular",
    mealTiming: "skip_breakfast",
    junkFoodFrequency: "3-4_times_week",
    portionSize: "larger_than_recommended",
    heartburnFrequency: "weekly",
    
    // Stress & Mental Health
    stressLevel: "high",
    workHours: "more_than_50",
    socialSupport: "limited",
    employmentSecurity: "concerned",
    emotionalWellbeing: "frequent_mood_swings",
    
    // Living Conditions
    housingStability: "stable",
    noiseLevel: "moderate",
    fastFoodAccess: "within_1_mile",
    neighborhoodSafety: "somewhat_safe",
    airQuality: "poor",
    
    // Physical Activity
    exerciseFrequency: "1-2_times_week",
    dailyMovement: "mostly_sitting",
    outdoorActivities: "rarely",
    walkingSteps: "3000-5000",
    workEnvironment: "desk_job",
    
    // Sleep Quality
    sleepDuration: "5-6_hours",
    sleepDisruption: "frequent",
    sleepSchedule: "irregular",
    fatigueDaytime: "often",
    sleepEnvironment: "noisy"
  });
  
  const [mentalHealthThoughts, setMentalHealthThoughts] = useState(
    "I've been feeling overwhelmed with work lately. Sometimes I worry about my family's health since my dad has diabetes. I find myself stress eating, especially late at night. I used to exercise regularly but work has been taking up all my time. I feel tired most days and sometimes worry about my future health."
  );
  
  const [riskScores, setRiskScores] = useState({
    digestive: 65,
    stress: 78,
    livingConditions: 45,
    activity: 70,
    sleep: 82,
    mentalHealth: 68
  });

  const handleResponseChange = (category: string, value: string) => {
    setResponses(prev => ({ ...prev, [category]: value }));
    // Simulate real-time risk calculation
    calculateRisk(category, value);
  };

  const calculateRisk = (category: string, value: string) => {
    // Simplified risk calculation logic
    const riskFactors = {
      eatingSchedule: { irregular: 20, somewhat_regular: 10, very_regular: 0 },
      junkFoodFrequency: { daily: 25, "3-4_times_week": 15, weekly: 10, rarely: 5 },
      stressLevel: { very_high: 25, high: 20, moderate: 10, low: 5 },
      exerciseFrequency: { never: 25, "1-2_times_week": 15, "3-4_times_week": 8, daily: 0 },
      sleepDuration: { "less_than_5": 25, "5-6_hours": 20, "7-8_hours": 5, "more_than_8": 10 }
    };
    
    // Update risk scores based on response
    // This would be more sophisticated in a real application
  };

  const getMentalHealthRisk = () => {
    const stressKeywords = ['overwhelmed', 'worry', 'stress', 'tired', 'exhausted'];
    const anxietyKeywords = ['anxiety', 'nervous', 'worried', 'afraid', 'concerned'];
    const depressionKeywords = ['sad', 'hopeless', 'empty', 'worthless', 'depressed'];
    
    const text = mentalHealthThoughts.toLowerCase();
    const stressCount = stressKeywords.filter(word => text.includes(word)).length;
    const anxietyCount = anxietyKeywords.filter(word => text.includes(word)).length;
    const depressionCount = depressionKeywords.filter(word => text.includes(word)).length;
    
    return {
      stress: stressCount > 2 ? 'High' : stressCount > 0 ? 'Moderate' : 'Low',
      anxiety: anxietyCount > 1 ? 'High' : anxietyCount > 0 ? 'Moderate' : 'Low',
      depression: depressionCount > 1 ? 'High' : depressionCount > 0 ? 'Moderate' : 'Low'
    };
  };

  const mentalHealthRisk = getMentalHealthRisk();

  const categories = [
    {
      title: "Digestive",
      icon: Heart,
      questions: [
        {
          id: "eatingSchedule",
          text: "How would you describe your eating schedule?",
          type: "radio",
          options: [
            { value: "very_regular", label: "Very regular - same times daily", risk: 0 },
            { value: "somewhat_regular", label: "Somewhat regular - minor variations", risk: 10 },
            { value: "irregular", label: "Irregular - varies significantly daily", risk: 20 }
          ]
        },
        {
          id: "mealTiming",
          text: "Which meals do you most commonly skip or delay?",
          type: "radio",
          options: [
            { value: "none", label: "I don't skip meals", risk: 0 },
            { value: "skip_breakfast", label: "Often skip breakfast", risk: 15 },
            { value: "skip_lunch", label: "Often skip lunch", risk: 10 },
            { value: "skip_dinner", label: "Often skip dinner", risk: 20 }
          ]
        },
        {
          id: "junkFoodFrequency",
          text: "How often do you consume processed/fast food?",
          type: "radio",
          options: [
            { value: "rarely", label: "Rarely (less than once/week)", risk: 5 },
            { value: "weekly", label: "1-2 times per week", risk: 10 },
            { value: "3-4_times_week", label: "3-4 times per week", risk: 15 },
            { value: "daily", label: "Daily or multiple times daily", risk: 25 }
          ]
        },
        {
          id: "portionSize",
          text: "How would you describe your typical portion sizes?",
          type: "radio",
          options: [
            { value: "smaller_than_recommended", label: "Smaller than recommended", risk: 5 },
            { value: "appropriate", label: "Appropriate/recommended size", risk: 0 },
            { value: "larger_than_recommended", label: "Larger than recommended", risk: 15 },
            { value: "much_larger", label: "Much larger than recommended", risk: 25 }
          ]
        },
        {
          id: "heartburnFrequency",
          text: "How often do you experience heartburn or acid reflux?",
          type: "radio",
          options: [
            { value: "never", label: "Never", risk: 0 },
            { value: "monthly", label: "Monthly or less", risk: 5 },
            { value: "weekly", label: "Weekly", risk: 10 },
            { value: "daily", label: "Daily", risk: 20 }
          ]
        }
      ]
    },
    {
      title: "Stress",
      icon: Brain,
      questions: [
        {
          id: "stressLevel",
          text: "How would you rate your overall stress level?",
          type: "radio",
          options: [
            { value: "low", label: "Low - rarely feel stressed", risk: 5 },
            { value: "moderate", label: "Moderate - manageable stress", risk: 10 },
            { value: "high", label: "High - frequently stressed", risk: 20 },
            { value: "very_high", label: "Very high - constantly overwhelmed", risk: 25 }
          ]
        },
        {
          id: "workHours",
          text: "How many hours do you typically work per week?",
          type: "radio",
          options: [
            { value: "less_than_20", label: "Less than 20 hours", risk: 5 },
            { value: "20-40", label: "20-40 hours", risk: 0 },
            { value: "40-50", label: "40-50 hours", risk: 10 },
            { value: "more_than_50", label: "More than 50 hours", risk: 20 }
          ]
        },
        {
          id: "socialSupport",
          text: "How would you describe your social support system?",
          type: "radio",
          options: [
            { value: "strong", label: "Strong - many supportive relationships", risk: 0 },
            { value: "moderate", label: "Moderate - some supportive people", risk: 8 },
            { value: "limited", label: "Limited - few supportive relationships", risk: 15 },
            { value: "none", label: "None - feel isolated", risk: 25 }
          ]
        },
        {
          id: "employmentSecurity",
          text: "How secure do you feel about your employment?",
          type: "radio",
          options: [
            { value: "very_secure", label: "Very secure", risk: 0 },
            { value: "somewhat_secure", label: "Somewhat secure", risk: 5 },
            { value: "concerned", label: "Somewhat concerned", risk: 15 },
            { value: "very_concerned", label: "Very concerned", risk: 25 }
          ]
        },
        {
          id: "emotionalWellbeing",
          text: "How would you describe your emotional well-being lately?",
          type: "radio",
          options: [
            { value: "excellent", label: "Excellent - very positive", risk: 0 },
            { value: "good", label: "Good - generally positive", risk: 5 },
            { value: "fair", label: "Fair - ups and downs", risk: 10 },
            { value: "frequent_mood_swings", label: "Frequent mood changes", risk: 18 },
            { value: "poor", label: "Poor - frequently negative", risk: 25 }
          ]
        }
      ]
    },
    {
      title: "Living Conditions",
      icon: Home,
      questions: [
        {
          id: "housingStability",
          text: "How stable is your current housing situation?",
          type: "radio",
          options: [
            { value: "very_stable", label: "Very stable - own home", risk: 0 },
            { value: "stable", label: "Stable - secure rental", risk: 5 },
            { value: "somewhat_unstable", label: "Somewhat unstable", risk: 15 },
            { value: "unstable", label: "Unstable - frequent moves", risk: 25 }
          ]
        },
        {
          id: "noiseLevel",
          text: "How would you describe noise levels in your neighborhood?",
          type: "radio",
          options: [
            { value: "quiet", label: "Very quiet", risk: 0 },
            { value: "moderate", label: "Moderate noise", risk: 8 },
            { value: "noisy", label: "Quite noisy", risk: 15 },
            { value: "very_noisy", label: "Very noisy/disruptive", risk: 20 }
          ]
        },
        {
          id: "fastFoodAccess",
          text: "How many fast food restaurants are within 1 mile of your home?",
          type: "radio",
          options: [
            { value: "none", label: "None", risk: 0 },
            { value: "1-2", label: "1-2 restaurants", risk: 5 },
            { value: "3-5", label: "3-5 restaurants", risk: 10 },
            { value: "within_1_mile", label: "More than 5 restaurants", risk: 15 }
          ]
        },
        {
          id: "neighborhoodSafety",
          text: "How safe do you feel in your neighborhood?",
          type: "radio",
          options: [
            { value: "very_safe", label: "Very safe", risk: 0 },
            { value: "somewhat_safe", label: "Somewhat safe", risk: 8 },
            { value: "neutral", label: "Neutral", risk: 12 },
            { value: "unsafe", label: "Unsafe", risk: 20 }
          ]
        },
        {
          id: "airQuality",
          text: "How would you rate the air quality in your area?",
          type: "radio",
          options: [
            { value: "excellent", label: "Excellent", risk: 0 },
            { value: "good", label: "Good", risk: 5 },
            { value: "fair", label: "Fair", risk: 10 },
            { value: "poor", label: "Poor", risk: 18 }
          ]
        }
      ]
    },
    {
      title: "Activity",
      icon: Activity,
      questions: [
        {
          id: "exerciseFrequency",
          text: "How often do you engage in structured exercise?",
          type: "radio",
          options: [
            { value: "daily", label: "Daily", risk: 0 },
            { value: "3-4_times_week", label: "3-4 times per week", risk: 8 },
            { value: "1-2_times_week", label: "1-2 times per week", risk: 15 },
            { value: "never", label: "Never or rarely", risk: 25 }
          ]
        },
        {
          id: "dailyMovement",
          text: "How would you describe your daily movement?",
          type: "radio",
          options: [
            { value: "very_active", label: "Very active throughout day", risk: 0 },
            { value: "moderately_active", label: "Moderately active", risk: 8 },
            { value: "mostly_sitting", label: "Mostly sitting with some movement", risk: 15 },
            { value: "sedentary", label: "Mostly sedentary", risk: 25 }
          ]
        },
        {
          id: "outdoorActivities",
          text: "How often do you participate in outdoor activities?",
          type: "radio",
          options: [
            { value: "daily", label: "Daily", risk: 0 },
            { value: "several_times_week", label: "Several times per week", risk: 5 },
            { value: "weekly", label: "Weekly", risk: 10 },
            { value: "rarely", label: "Rarely", risk: 18 }
          ]
        },
        {
          id: "walkingSteps",
          text: "Approximately how many steps do you take daily?",
          type: "radio",
          options: [
            { value: "more_than_10000", label: "More than 10,000", risk: 0 },
            { value: "7000-10000", label: "7,000-10,000", risk: 5 },
            { value: "3000-5000", label: "3,000-5,000", risk: 15 },
            { value: "less_than_3000", label: "Less than 3,000", risk: 25 }
          ]
        },
        {
          id: "workEnvironment",
          text: "What best describes your work environment?",
          type: "radio",
          options: [
            { value: "active_job", label: "Active job requiring movement", risk: 0 },
            { value: "mixed", label: "Mix of sitting and standing", risk: 8 },
            { value: "desk_job", label: "Primarily desk/computer work", risk: 15 },
            { value: "completely_sedentary", label: "Completely sedentary", risk: 20 }
          ]
        }
      ]
    },
    {
      title: "Sleep",
      icon: Bed,
      questions: [
        {
          id: "sleepDuration",
          text: "How many hours of sleep do you typically get?",
          type: "radio",
          options: [
            { value: "more_than_8", label: "More than 8 hours", risk: 10 },
            { value: "7-8_hours", label: "7-8 hours", risk: 0 },
            { value: "5-6_hours", label: "5-6 hours", risk: 20 },
            { value: "less_than_5", label: "Less than 5 hours", risk: 25 }
          ]
        },
        {
          id: "sleepDisruption",
          text: "How often is your sleep disrupted during the night?",
          type: "radio",
          options: [
            { value: "rarely", label: "Rarely", risk: 0 },
            { value: "occasionally", label: "Occasionally (1-2 times/week)", risk: 8 },
            { value: "frequent", label: "Frequently (3-4 times/week)", risk: 18 },
            { value: "nightly", label: "Almost nightly", risk: 25 }
          ]
        },
        {
          id: "sleepSchedule",
          text: "How consistent is your sleep schedule?",
          type: "radio",
          options: [
            { value: "very_consistent", label: "Very consistent", risk: 0 },
            { value: "mostly_consistent", label: "Mostly consistent", risk: 5 },
            { value: "irregular", label: "Irregular", risk: 15 },
            { value: "very_irregular", label: "Very irregular", risk: 20 }
          ]
        },
        {
          id: "fatigueDaytime",
          text: "How often do you feel tired during the day?",
          type: "radio",
          options: [
            { value: "never", label: "Never", risk: 0 },
            { value: "rarely", label: "Rarely", risk: 5 },
            { value: "sometimes", label: "Sometimes", risk: 10 },
            { value: "often", label: "Often", risk: 20 },
            { value: "always", label: "Almost always", risk: 25 }
          ]
        },
        {
          id: "sleepEnvironment",
          text: "How would you describe your sleep environment?",
          type: "radio",
          options: [
            { value: "optimal", label: "Optimal (dark, quiet, cool)", risk: 0 },
            { value: "good", label: "Good with minor issues", risk: 5 },
            { value: "fair", label: "Fair - some disruptions", risk: 12 },
            { value: "poor", label: "Poor - multiple disruptions", risk: 18 },
            { value: "noisy", label: "Very poor (bright/noisy)", risk: 25 }
          ]
        }
      ]
    }
  ];

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Very High", color: "text-red-600", bg: "bg-red-100" };
    if (score >= 60) return { level: "High", color: "text-orange-600", bg: "bg-orange-100" };
    if (score >= 40) return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "Low", color: "text-green-600", bg: "bg-green-100" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/patient/${id}/examination`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Lifestyle and Social Context</h1>
              <p className="text-muted-foreground">Patient: Pooja Shah • Female • Age: 35</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sections: daily habits and routines · access and stability · support and understanding.
                Responses are patient reported and are used as contributing context only, never as a diagnosis.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            Patient reported context
          </Badge>
        </div>


        {/* Risk Summary Cards */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          {Object.entries(riskScores).map(([category, score]) => {
            const risk = getRiskLevel(score);
            return (
              <Card key={category} className={`${risk.bg} border-2`}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold mb-1">{score}%</div>
                  <div className="text-sm font-medium capitalize mb-2">{category}</div>
                  <Badge variant="outline" className={`${risk.color} text-xs`}>
                    {risk.level}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Assessment Questions */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {categories.map((category) => (
            <Card key={category.title} className="h-fit">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <category.icon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {category.questions.map((question) => (
                  <div key={question.id} className="space-y-3">
                    <Label className="text-sm font-medium leading-relaxed">
                      {question.text}
                    </Label>
                    <RadioGroup 
                      value={responses[question.id] || ""}
                      onValueChange={(value) => handleResponseChange(question.id, value)}
                      className="space-y-2"
                    >
                      {question.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option.value} 
                            id={`${question.id}-${option.value}`}
                            className="shrink-0"
                          />
                          <Label 
                            htmlFor={`${question.id}-${option.value}`}
                            className="text-sm leading-relaxed cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mental Health Assessment */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Share Your Thoughts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Please share whatever comes to your mind about your health, stress, concerns, or feelings. 
              This will help us assess mental health risk factors.
            </p>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={mentalHealthThoughts}
              onChange={(e) => setMentalHealthThoughts(e.target.value)}
              className="min-h-[120px] mb-4"
              placeholder="Share your thoughts, concerns, feelings, or anything on your mind..."
            />
            
            {/* Mental health summary */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Mental health and stress summary
              </h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {mentalHealthRisk.stress}
                  </div>
                  <div className="text-sm text-muted-foreground">Stress Level</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {mentalHealthRisk.anxiety}
                  </div>
                  <div className="text-sm text-muted-foreground">Anxiety Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {mentalHealthRisk.depression}
                  </div>
                  <div className="text-sm text-muted-foreground">Depression Risk</div>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="text-sm">
                  <strong>Key Indicators Detected:</strong> Work stress, family health concerns, emotional eating patterns, 
                  sleep disruption, exercise reduction. Recommend stress management and lifestyle intervention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Risk Assessment */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Lifestyle and Social Context Summary
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Contributing context for physician review. Not a diagnostic score.
            </p>
          </CardHeader>
          <CardContent>


            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Composite Risk Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on all social determinant factors
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">68%</div>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Primary Concerns</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Poor sleep quality (82% risk)</li>
                    <li>• High stress levels (78% risk)</li>
                    <li>• Limited physical activity (70% risk)</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Intervention Areas</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Sleep hygiene counseling</li>
                    <li>• Stress management techniques</li>
                    <li>• Physical activity planning</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Protective Factors</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Stable housing situation</li>
                    <li>• Regular medical follow-up</li>
                    <li>• Family health awareness</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={() => navigate(`/patient/${id}/examination`)}
          >
            Back to Examination
          </Button>
          
          <Button 
            onClick={() => navigate(`/recommendations/${id}`)}
            className="bg-primary hover:bg-primary/90"
          >
            Generate Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SDOHAssessment;