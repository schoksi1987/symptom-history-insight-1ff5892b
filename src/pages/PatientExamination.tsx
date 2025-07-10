import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PatientExamination = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Pre-filled patient data for Pooja Shah
  const [vitals, setVitals] = useState({
    bmi: "28.4",
    weight: "70",
    bloodPressureHigh: "142",
    bloodPressureLow: "88",
    temperature: "98.6",
    pulse: "78",
    waistCircumference: "92",
    totalCholesterol: "245",
    hdl: "38",
    ldl: "165",
    vldl: "42",
    triglyceride: "285",
    bloodSugar: "158",
    hba1c: "8.2",
    glucose: "165"
  });

  const [symptoms, setSymptoms] = useState([
    "Frequent Urination", 
    "Increased Thirst", 
    "Fatigue", 
    "Blurred Vision"
  ]);

  const [familyHistory, setFamilyHistory] = useState({
    mother: false,
    father: true,
    sibling: false,
    grandMother: false,
    grandFather: true
  });

  const [patientNotes, setPatientNotes] = useState(
    "Patient reports increased fatigue over the past 3 months, especially after meals. Experiencing frequent urination (polyuria) - approximately 8-10 times daily, including 2-3 times at night (nocturia). Patient mentions increased thirst and has been drinking more water than usual. Complains of occasional blurred vision, particularly when reading. Reports mild tingling sensation in feet during evening hours. Patient states she has been under increased stress at work and admits to irregular eating patterns. No chest pain or shortness of breath reported. Sleep quality has decreased due to frequent nighttime urination. Patient is concerned about family history of diabetes and requests screening."
  );

  const [location] = useState({
    address: "Springfield, Missouri 65804",
    zipCode: "65804",
    city: "Springfield",
    state: "Missouri"
  });

  // Geographic risk data for Springfield, MO
  const geoRiskData = {
    diabetesPrevalence: "12.8%",
    obesityRate: "34.2%",
    fastFoodDensity: "High (15 per sq mile)",
    educationLevel: "68% High School, 28% Bachelor's",
    medianIncome: "$42,000",
    riskLevel: "Elevated",
    populationRisk: "Above National Average"
  };

  const handleVitalChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleFamilyHistoryChange = (member: string, checked: boolean) => {
    setFamilyHistory(prev => ({ ...prev, [member]: checked }));
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
              onClick={() => navigate(`/patient/${id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Patient Examination</h1>
              <p className="text-muted-foreground">Patient: Pooja Shah • Gender: Female • Age: 35 • Height: 157cm</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            Examination in Progress
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Add Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle>Current Symptoms</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Type in or select symptoms, indicate as many as you can for more accurate results.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={(value) => addSymptom(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select symptoms..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frequent Urination">Frequent Urination</SelectItem>
                    <SelectItem value="Increased Thirst">Increased Thirst</SelectItem>
                    <SelectItem value="Fatigue">Fatigue</SelectItem>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Blurred Vision">Blurred Vision</SelectItem>
                    <SelectItem value="Slow Healing">Slow Healing</SelectItem>
                    <SelectItem value="Tingling in Feet">Tingling in Feet</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeSymptom(symptom)}
                    >
                      {symptom} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Vitals */}
            <Card>
              <CardHeader>
                <CardTitle>Your Health Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>BMI Rate (kg/cm2)</Label>
                    <Input 
                      value={vitals.bmi}
                      onChange={(e) => handleVitalChange('bmi', e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>
                  <div>
                    <Label>Weight (in kg)</Label>
                    <Input 
                      value={vitals.weight}
                      onChange={(e) => handleVitalChange('weight', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Blood Pressure</Label>
                    <div className="flex gap-2 items-center">
                      <Input 
                        value={vitals.bloodPressureHigh}
                        onChange={(e) => handleVitalChange('bloodPressureHigh', e.target.value)}
                        className="bg-red-50"
                      />
                      <span>/</span>
                      <Input 
                        value={vitals.bloodPressureLow}
                        onChange={(e) => handleVitalChange('bloodPressureLow', e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>High</span>
                      <span>Low</span>
                    </div>
                  </div>
                  <div>
                    <Label>Waist Circumference</Label>
                    <Input 
                      value={vitals.waistCircumference}
                      onChange={(e) => handleVitalChange('waistCircumference', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Body Temperature (Celsius)</Label>
                    <Input 
                      value={vitals.temperature}
                      onChange={(e) => handleVitalChange('temperature', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Pulse</Label>
                    <Input 
                      value={vitals.pulse}
                      onChange={(e) => handleVitalChange('pulse', e.target.value)}
                    />
                  </div>
                </div>

                {/* Lipid Profile */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Lipid Profile (mg/dl)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Total Cholesterol</Label>
                      <Input 
                        value={vitals.totalCholesterol}
                        onChange={(e) => handleVitalChange('totalCholesterol', e.target.value)}
                        className="bg-yellow-50"
                      />
                    </div>
                    <div>
                      <Label>Cholesterol (if known)</Label>
                      <div className="flex gap-2">
                        <div>
                          <Input 
                            value={vitals.hdl}
                            onChange={(e) => handleVitalChange('hdl', e.target.value)}
                            placeholder="HDL"
                            className="bg-red-50"
                          />
                          <span className="text-xs text-muted-foreground">HDL</span>
                        </div>
                        <span className="self-center">/</span>
                        <div>
                          <Input 
                            value={vitals.ldl}
                            onChange={(e) => handleVitalChange('ldl', e.target.value)}
                            placeholder="LDL"
                            className="bg-red-50"
                          />
                          <span className="text-xs text-muted-foreground">LDL</span>
                        </div>
                        <span className="self-center">/</span>
                        <div>
                          <Input 
                            value={vitals.vldl}
                            onChange={(e) => handleVitalChange('vldl', e.target.value)}
                            placeholder="VLDL"
                          />
                          <span className="text-xs text-muted-foreground">VLDL</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Triglyceride</Label>
                      <Input 
                        value={vitals.triglyceride}
                        onChange={(e) => handleVitalChange('triglyceride', e.target.value)}
                        className="bg-red-50"
                      />
                    </div>
                    <div>
                      <Label>Blood Sugar</Label>
                      <Input 
                        value={vitals.bloodSugar}
                        onChange={(e) => handleVitalChange('bloodSugar', e.target.value)}
                        className="bg-red-50"
                      />
                    </div>
                    <div>
                      <Label>HbA1c</Label>
                      <Input 
                        value={vitals.hba1c}
                        onChange={(e) => handleVitalChange('hba1c', e.target.value)}
                        className="bg-red-50"
                      />
                    </div>
                    <div>
                      <Label>Glucose</Label>
                      <Input 
                        value={vitals.glucose}
                        onChange={(e) => handleVitalChange('glucose', e.target.value)}
                        className="bg-red-50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family History */}
            <Card>
              <CardHeader>
                <CardTitle>Family History</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Please check if Mother, Father, Brother/Sister, Grandparents have had any of the following.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4 text-center font-medium border-b pb-2">
                    <span></span>
                    <span>Mother</span>
                    <span>Father</span>
                    <span>Brother/Sister</span>
                    <span>Grand Mother</span>
                    <span>Grand Father</span>
                  </div>
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <span className="font-medium">Diabetes</span>
                    <Checkbox 
                      checked={familyHistory.mother}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('mother', checked as boolean)}
                    />
                    <Checkbox 
                      checked={familyHistory.father}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('father', checked as boolean)}
                    />
                    <Checkbox 
                      checked={familyHistory.sibling}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('sibling', checked as boolean)}
                    />
                    <Checkbox 
                      checked={familyHistory.grandMother}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('grandMother', checked as boolean)}
                    />
                    <Checkbox 
                      checked={familyHistory.grandFather}
                      onCheckedChange={(checked) => handleFamilyHistoryChange('grandFather', checked as boolean)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Geographic Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geographic Risk Assessment
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Risk analysis based on location demographics and health statistics
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{location.address}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Zip Code: {location.zipCode} • {location.city}, {location.state}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Diabetes Prevalence</span>
                    </div>
                    <Badge variant="destructive">{geoRiskData.diabetesPrevalence}</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Obesity Rate</span>
                    </div>
                    <Badge variant="secondary">{geoRiskData.obesityRate}</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Fast Food Density</span>
                    </div>
                    <Badge variant="outline">{geoRiskData.fastFoodDensity}</Badge>
                  </div>

                  <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Demographics</div>
                    <div className="text-sm space-y-1">
                      <div>Education: {geoRiskData.educationLevel}</div>
                      <div>Median Income: {geoRiskData.medianIncome}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Risk Level</span>
                      <Badge variant="destructive" className="bg-red-600">
                        {geoRiskData.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {geoRiskData.populationRisk} - Higher intervention recommended
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Notes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Document patient's concerns, symptoms, and observations for NLP analysis
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="Enter detailed patient notes, symptoms, and observations..."
                  className="min-h-[300px] text-sm"
                />
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">NLP Analysis Active</span>
                  </div>
                  <div className="text-xs text-blue-700">
                    Identified symptoms: Polyuria, Polydipsia, Fatigue, Blurred Vision, Neuropathy
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  + Add Document
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline"
            onClick={() => navigate(`/patient/${id}`)}
          >
            Back to Patient Dashboard
          </Button>
          <div className="flex gap-4">
            <Button variant="outline">Save Draft</Button>
            <Button 
              onClick={() => navigate('/recommendations')}
              className="bg-primary hover:bg-primary/90"
            >
              Generate Recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientExamination;