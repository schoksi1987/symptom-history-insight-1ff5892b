import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopilotPanel } from "@/components/clinical/CopilotPanel";
import { PrototypeBanner } from "@/components/clinical/PrototypeBanner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, AlertTriangle, TrendingUp, Users, Edit, Trash2, Plus, Loader2, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { patientUserIdFromRoute } from "@/lib/patientContext";
import { toast } from "sonner";

const PatientExamination = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saving, setSaving] = useState(false);

  const handleSaveExamination = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be signed in to save an examination.");
        return;
      }
      const patientUserId = patientUserIdFromRoute(id);
      if (!patientUserId) {
        toast.error("This is a demonstration patient. Examinations can only be saved for real patient records.");
        return;
      }
      const height_cm = 157;
      const weight_kg = parseFloat(vitals.weight) || null;
      const payload: any = {
        patient_user_id: patientUserId,
        examined_by: user.id,
        examined_at: new Date().toISOString(),
        height_cm,
        weight_kg,
        waist_cm: parseFloat(vitals.waistCircumference) || null,
        systolic_bp: parseFloat(vitals.bloodPressureHigh) || null,
        diastolic_bp: parseFloat(vitals.bloodPressureLow) || null,
        heart_rate: parseFloat(vitals.pulse) || null,
        temperature_c: parseFloat(vitals.temperature) || null,
        hba1c: parseFloat(vitals.hba1c) || null,
        fasting_glucose: parseFloat(vitals.bloodSugar) || null,
        random_glucose: parseFloat(vitals.glucose) || null,
        ldl: parseFloat(vitals.ldl) || null,
        hdl: parseFloat(vitals.hdl) || null,
        triglycerides: parseFloat(vitals.triglyceride) || null,
        total_cholesterol: parseFloat(vitals.totalCholesterol) || null,
        family_history_diabetes: Object.values(familyHistory).some(Boolean),
        body_systems: bodySystemExam,
        medications,
        physician_findings: physicianFindings,
        patient_notes: patientNotes,
      };
      const { error } = await (supabase as any).from("examinations").insert(payload);
      if (error) throw error;
      // Trigger risk recompute
      await supabase.functions.invoke("compute-risk-score", { body: { patientId: patientUserId } });
      toast.success("Examination saved. Risk score recomputed.");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save examination");
    } finally {
      setSaving(false);
    }
  };

  
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

  const [familyDetails, setFamilyDetails] = useState({
    father: {
      conditions: ['Diabetes'],
      conditionAges: { 'Diabetes': 45 },
      lifestyleFactors: ['Poor eating habits/Smoking/Drinking', 'Inactive lifestyle/Lack of Exercise'],
      symptoms: ['Frequent urination', 'Increased thirst', 'Fatigue']
    }
  });

  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [showFamilyDialog, setShowFamilyDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [bodySystemExam, setBodySystemExam] = useState({
    eyes: { normal: true, comments: '' },
    ears: { normal: true, comments: '' },
    nose: { normal: true, comments: '' },
    mouthThroat: { normal: true, comments: '' },
    headFaceNeck: { normal: true, comments: '' },
    breasts: { normal: true, comments: '' },
    lungs: { normal: true, comments: '' },
    cardiovascular: { normal: true, comments: '' },
    extremities: { normal: true, comments: '' },
    abdomen: { normal: true, comments: '' },
    gastrointestinal: { normal: true, comments: '' },
    endocrine: { normal: true, comments: '' },
    reproductive: { normal: true, comments: '' },
    lymphatic: { normal: true, comments: '' },
    nervousSystem: { normal: true, comments: '' },
    visionScreening: { normal: true, comments: '' },
    hearingScreening: { normal: true, comments: '' }
  });

  const [medications, setMedications] = useState([
    { name: 'Metformin', dosage: '500mg twice daily', reason: 'Blood sugar control' }
  ]);

  const [physicianFindings, setPhysicianFindings] = useState(
    "Initial Assessment: 35-year-old female presents with classic diabetic symptoms including polyuria, polydipsia, and fatigue over 3-month period. Physical examination reveals BMI of 28.4 (overweight), elevated BP 142/88, signs of metabolic syndrome. Laboratory findings significant for HbA1c 8.2% (elevated), fasting glucose 165 mg/dL, lipid panel showing dyslipidemia with total cholesterol 245, HDL 38 (low), LDL 165, triglycerides 285 (elevated). Patient demonstrates signs of insulin resistance with acanthosis nigricans noted. Fundoscopic exam shows early diabetic retinopathy changes. Peripheral sensation intact but reports intermittent paresthesias. Strong family history of T2DM (father diagnosed at 45). Patient exhibits multiple SDOH risk factors including work-related stress, irregular meal patterns, sedentary lifestyle. Immediate intervention required to prevent progression."
  );

  const [patientNotes, setPatientNotes] = useState(
    "Patient reports increased fatigue over the past 3 months, especially after meals. Experiencing frequent urination (polyuria) - approximately 8-10 times daily, including 2-3 times at night (nocturia). Patient mentions increased thirst and has been drinking more water than usual. Complains of occasional blurred vision, particularly when reading. Reports mild tingling sensation in feet during evening hours. Patient states she has been under increased stress at work and admits to irregular eating patterns. No chest pain or shortness of breath reported. Sleep quality has decreased due to frequent nighttime urination. Patient is concerned about family history of diabetes and requests screening. Lifestyle factors: Works desk job with minimal physical activity, drinks 3-4 cups of coffee daily, skips breakfast frequently, eats lunch irregularly due to work demands. Lives in food desert area with limited access to fresh produce. Single mother managing household stress."
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
    if (checked) {
      setSelectedFamilyMember(member);
      setShowFamilyDialog(true);
    }
  };

  const handleBodySystemChange = (system: string, field: string, value: boolean | string) => {
    setBodySystemExam(prev => ({
      ...prev,
      [system]: { ...prev[system], [field]: value }
    }));
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', reason: '' }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const familyMemberNames = {
    mother: 'Mother',
    father: 'Father',
    sibling: 'Brother/Sister',
    grandMother: 'Grand Mother',
    grandFather: 'Grand Father'
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
              <h1 className="text-3xl font-bold">Visit Workspace</h1>
              <p className="text-muted-foreground">Patient: Pooja Shah • Gender: Female • Age: 35 • Height: 157cm</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {currentStep === 1
              ? "Step 1 of 3 — Patient reported information"
              : currentStep === 2
                ? "Step 2 of 3 — Physician examination"
                : "Step 3 of 3 — Review and decisions"}
          </Badge>
        </div>

        <PrototypeBanner className="mb-6" />

        <div className="mb-8">
          <CopilotPanel patientId={id} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column */}
          <div className="space-y-6">
            {/* Physician Findings - First Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" />
                  Physician Examination & Initial Findings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Record patient conversation, physical examination findings, and initial clinical assessment
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Clinical Findings & Assessment</Label>
                    <Textarea
                      value={physicianFindings}
                      onChange={(e) => setPhysicianFindings(e.target.value)}
                      placeholder="Record patient history, physical examination findings, clinical observations, and preliminary assessment..."
                      className="min-h-[200px] bg-blue-50/50 border-blue-200"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    🎤 Start Voice Recording
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Patient Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Reported Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Patient's own description of symptoms, concerns, and lifestyle factors
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="Patient's description of symptoms, concerns, lifestyle factors, and personal observations..."
                  className="min-h-[150px] bg-green-50/50 border-green-200"
                />
              </CardContent>
            </Card>

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
                  
                  {/* Show family member details */}
                  {familyHistory.father && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Father's Diabetes History</h4>
                      <div className="text-sm space-y-1">
                        <div><strong>Diagnosed at:</strong> Age 45</div>
                        <div><strong>Symptoms before diagnosis:</strong> Frequent urination, increased thirst, fatigue</div>
                        <div><strong>Lifestyle factors:</strong> Poor eating habits, smoking, inactive lifestyle</div>
                        <div><strong>Current status:</strong> Managed with medication and diet</div>
                      </div>
                    </div>
                  )}
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

            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle>Medications (including OTC & herbs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.map((med, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                    <div>
                      <Label>Name</Label>
                      <Input 
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        placeholder="Medication name"
                      />
                    </div>
                    <div>
                      <Label>Mg./Dosage</Label>
                      <Input 
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        placeholder="Dosage"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label>Reason why you are taking</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={med.reason}
                          onChange={(e) => updateMedication(index, 'reason', e.target.value)}
                          placeholder="Reason"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeMedication(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addMedication} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </Card>

            {/* Patient Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Notes</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Describe patient concerns, symptoms, and observations in detail so they can be reviewed
                </p>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Enter detailed patient notes, symptoms, and observations..."
                />
                
                {/* Documented symptoms */}
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Symptoms identified from these notes</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-100">Polyuria (Frequent Urination)</Badge>
                    <Badge variant="outline" className="bg-green-100">Polydipsia (Increased Thirst)</Badge>
                    <Badge variant="outline" className="bg-green-100">Fatigue</Badge>
                    <Badge variant="outline" className="bg-green-100">Blurred Vision</Badge>
                    <Badge variant="outline" className="bg-green-100">Nocturia</Badge>
                    <Badge variant="outline" className="bg-green-100">Peripheral Neuropathy</Badge>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    ✓ High confidence diabetes-related symptoms detected
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Body System Examination */}
            {currentStep >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Body System Examination</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Complete physical examination findings for each body system
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium border-b pb-2">
                      <span>Symptom Name</span>
                      <span>Normal Findings</span>
                      <span>Comments/Description</span>
                      <span>Action</span>
                    </div>
                    
                    {Object.entries(bodySystemExam).map(([system, data]) => (
                      <div key={system} className="grid grid-cols-4 gap-4 items-center py-2 border-b">
                        <span className="capitalize font-medium">
                          {system.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center">
                          <span className={data.normal ? "text-green-600" : "text-red-600"}>
                            {data.normal ? "Yes" : "No"}
                          </span>
                        </div>
                        <Input 
                          value={data.comments}
                          onChange={(e) => handleBodySystemChange(system, 'comments', e.target.value)}
                          placeholder="Add comments..."
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleBodySystemChange(system, 'normal', !data.normal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full mt-4 bg-primary text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add System
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Physician Examination Findings */}
            {currentStep >= 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Physician Examination Findings:</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={physicianFindings}
                    onChange={(e) => setPhysicianFindings(e.target.value)}
                    className="min-h-[150px]"
                    placeholder="Enter detailed physician examination findings, observations, and clinical impressions..."
                  />
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Additional Comments</h4>
                    <Textarea 
                      placeholder="Additional clinical observations, recommendations, or notes..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Family History Dialog */}
          <Dialog open={showFamilyDialog} onOpenChange={setShowFamilyDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Family Relation - {selectedFamilyMember && familyMemberNames[selectedFamilyMember]}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Conditions */}
                <div>
                  <h3 className="font-medium mb-3">Conditions</h3>
                  <div className="space-y-2">
                    {['Obesity', 'High Cholesterol', 'High Blood Pressure', 'High Triglyceride', 'Depression'].map((condition) => (
                      <div key={condition} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox />
                          <Label>{condition}</Label>
                        </div>
                        <Input placeholder="Age" className="w-20" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lifestyle Factors */}
                <div>
                  <h3 className="font-medium mb-3">LifeStyle Factors</h3>
                  <div className="space-y-2">
                    {[
                      'Poor eating habits/Smoking/Drinking',
                      'Stress',
                      'Inactive lifestyle/Lack of Exercise',
                      'Poor Sleep Habits',
                      'Lower Income/Poor Living Conditions'
                    ].map((factor) => (
                      <div key={factor} className="flex items-center space-x-2">
                        <Checkbox />
                        <Label>{factor}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <h3 className="font-medium mb-3">Symptoms</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frequent-urination">Frequent urination</SelectItem>
                      <SelectItem value="increased-thirst">Increased thirst</SelectItem>
                      <SelectItem value="fatigue">Fatigue</SelectItem>
                      <SelectItem value="weight-loss">Unexplained weight loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowFamilyDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowFamilyDialog(false)}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Navigation Steps */}
          <div className="lg:col-span-2 mt-8">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={previousStep} disabled={currentStep === 1}>
                Back
              </Button>
              
              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleSaveExamination} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Examination
                </Button>
                {currentStep < 3 ? (
                  <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate(`/patient/${id}/sdoh`)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    SDOH Assessment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientExamination;