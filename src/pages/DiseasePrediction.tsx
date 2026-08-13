import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Brain, 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Stethoscope,
  FileText,
  BarChart,
  Target
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

const DiseasePrediction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    symptoms: '',
    familyHistory: '',
    lifestyle: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    // Simulate AI prediction
    setTimeout(() => {
      setPrediction({
        riskScore: 71,
        primaryRisk: "Type 2 Diabetes",
        riskLevel: "High",
        confidence: 85,
        factors: [
          "Family history of diabetes",
          "BMI indicates overweight",
          "Sedentary lifestyle",
          "Age factor (30-40)"
        ],
        recommendations: [
          "Schedule HbA1c test within 2 weeks",
          "Begin moderate exercise routine",
          "Consult with endocrinologist",
          "Consider dietary modification"
        ]
      });
      setLoading(false);
    }, 2000);
  };

  const getRiskColor = (score) => {
    if (score >= 70) return "text-red-600";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AppHeader />
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AI Disease Prediction</h1>
            </div>
            <div className="space-x-4">
              {user ? (
                <Button onClick={() => navigate("/dashboard")} variant="outline">
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")} variant="default">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl mb-6">
            Predict Disease Risk with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Advanced machine learning algorithms analyze your health data to predict disease risk 
            and provide personalized recommendations for preventive care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Health Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="35"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="170"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="height">Height (ft)</Label>
                <Input
                  id="height"
                  placeholder="5.8"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="familyHistory">Family History</Label>
                <Select value={formData.familyHistory} onValueChange={(value) => setFormData({...formData, familyHistory: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family history" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No known family history</SelectItem>
                    <SelectItem value="diabetes">Diabetes</SelectItem>
                    <SelectItem value="heart">Heart disease</SelectItem>
                    <SelectItem value="both">Both diabetes and heart disease</SelectItem>
                    <SelectItem value="other">Other conditions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lifestyle">Lifestyle</Label>
                <Select value={formData.lifestyle} onValueChange={(value) => setFormData({...formData, lifestyle: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lifestyle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Very active</SelectItem>
                    <SelectItem value="moderate">Moderately active</SelectItem>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="symptoms">Current Symptoms</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe any symptoms you're experiencing..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                />
              </div>

              <Button 
                onClick={handlePredict} 
                className="w-full" 
                disabled={loading || !formData.age || !formData.weight}
              >
                {loading ? "Analyzing..." : "Predict Disease Risk"}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                AI Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prediction ? (
                <div className="space-y-6">
                  {/* Risk Score */}
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getRiskColor(prediction.riskScore)}`}>
                      {prediction.riskScore}%
                    </div>
                    <p className="text-gray-600">Risk Score for {prediction.primaryRisk}</p>
                    <Badge 
                      variant={prediction.riskLevel === "High" ? "destructive" : prediction.riskLevel === "Medium" ? "default" : "secondary"}
                      className="mt-2"
                    >
                      {prediction.riskLevel} Risk
                    </Badge>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-sm font-medium">{prediction.confidence}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="w-full" />
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Key Risk Factors
                    </h4>
                    <ul className="space-y-2">
                      {prediction.factors.map((factor, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {user && (
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => navigate("/recommendations")} 
                        className="w-full"
                        variant="outline"
                      >
                        View Detailed Analysis
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Complete the health assessment to get your AI-powered disease risk prediction
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600 text-sm">
              Advanced machine learning algorithms analyze multiple health factors
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-time Results</h3>
            <p className="text-gray-600 text-sm">
              Get instant predictions based on current health data
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Stethoscope className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Clinical Accuracy</h3>
            <p className="text-gray-600 text-sm">
              Validated against clinical research and peer-reviewed studies
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Preventive Care</h3>
            <p className="text-gray-600 text-sm">
              Personalized recommendations for early intervention
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiseasePrediction;