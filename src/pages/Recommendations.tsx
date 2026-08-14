import React, { useState, useEffect } from 'react';
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
  BarChart,
  Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { patientUserIdFromRoute } from "@/lib/patientContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ClinicalStatusBanner } from "@/components/clinical/ClinicalStatusBanner";
import { SuggestedActionCard } from "@/components/clinical/SuggestedActionCard";
import { MissingDataPanel } from "@/components/clinical/MissingDataPanel";
import { DataCompletenessMeter, AssessmentConfidence } from "@/components/clinical/DataCompletenessMeter";
import { AuditInformationDrawer } from "@/components/clinical/AuditInformationDrawer";
import { CohortUnavailableState } from "@/components/clinical/CohortUnavailableState";
import { PatientPlanPreview } from "@/components/clinical/PatientPlanPreview";
import { PrototypeBanner } from "@/components/clinical/PrototypeBanner";
import { useClinicalDataSource } from "@/hooks/useClinicalDataSource";
import type {
  PatientClinicalSummary,
  SuggestedAction,
  CohortAnalysis,
  PatientPlan,
} from "@/types/clinical";

const Recommendations = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [peerFindings, setPeerFindings] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [clinicalSummary, setClinicalSummary] = useState<PatientClinicalSummary | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[]>([]);
  const [cohort, setCohort] = useState<CohortAnalysis | null>(null);
  const [plan, setPlan] = useState<PatientPlan | null>(null);
  const clinical = useClinicalDataSource();

  useEffect(() => {
    const patientId = id ?? "demo";
    clinical.getPatientClinicalSummary(patientId).then(setClinicalSummary);
    clinical.getSuggestedActions(patientId).then(setSuggestedActions);
    clinical.getCohortAnalysis(patientId).then(setCohort);
    clinical.generatePatientPlan(patientId).then(setPlan);
  }, [id, clinical]);

  const saveRecommendationDecision = async (
    recommendationId: string,
    decision: "Accept" | "Modify" | "Dismiss",
    payload?: { rationale?: string; modifiedTitle?: string },
  ) => clinical.saveRecommendationDecision(recommendationId, { decision, ...payload });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setLoading(true);

        // Existing analysis is keyed by the patient under review, not the clinician.
        const patientUserId = patientUserIdFromRoute(id);
        const { data: existingAnalysis } = patientUserId
          ? await supabase
          .from('patient_similarity_analysis')
          .select('*')
          .eq('patient_id', patientUserId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
          : { data: null };

        if (existingAnalysis) {
          setAnalysis(existingAnalysis);
        }

        // Fetch news, peer findings, and trends
        const [newsData, peerData, trendsData] = await Promise.all([
          supabase.from('clinical_news').select('*').order('published_date', { ascending: false }).limit(5),
          supabase.from('peer_findings').select('*').order('publication_date', { ascending: false }).limit(5),
          supabase.from('statistical_trends').select('*').limit(5)
        ]);

        if (newsData.data) setNews(newsData.data);
        if (peerData.data) setPeerFindings(peerData.data);
        if (trendsData.data) setTrends(trendsData.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const generateInsights = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to generate insights",
          variant: "destructive"
        });
        return;
      }

      const patientUserId = patientUserIdFromRoute(id);
      if (!patientUserId) {
        toast({
          title: "Demonstration patient",
          description: "Insights can only be generated for real patient records.",
          variant: "destructive"
        });
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.functions.invoke('generate-patient-insights', {
        body: { patientId: patientUserId }
      });

      if (error) throw error;

      if (data?.analysis) {
        setAnalysis(data.analysis);
        toast({
          title: "Success",
          description: "AI-powered insights generated successfully"
        });
      }
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate insights",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // AI-powered insights from physician and patient notes
  const aiInsights = {
    riskAnalysis: "Based on comprehensive analysis of physician findings and patient-reported symptoms, this case demonstrates classic pre-diabetic progression with strong familial correlation. The combination of elevated HbA1c (8.2%), metabolic syndrome markers, and SDOH stressors creates a 71% risk profile for T2DM development within 12 months without intervention.",
    peerComparisons: [
      {
        cohort: "Similar Age Group (30-40, Female)",
        riskFactors: "BMI >25, Family History, SDOH Stress",
        outcomes: "68% developed T2DM within 18 months without intervention",
        interventions: "Metformin + lifestyle modification reduced risk by 58%"
      },
      {
        cohort: "Geographic Cohort (Springfield, MO)",
        riskFactors: "Food desert, elevated diabetes prevalence (12.8%)",
        outcomes: "Regional risk 2.3x higher than national average",
        interventions: "Community-based nutrition programs showed 45% improvement"
      }
    ],
    clinicalPatterns: [
      "Patient's symptom progression matches 89% of similar cases that developed T2DM",
      "Work stress + irregular eating pattern found in 76% of high-risk cohort",
      "Family history pattern (father at 45) correlates with 15-year earlier onset in offspring"
    ]
  };
  
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
      outcome: "Pre-diabetes reversed within 6 months",
      intervention: "Stress management + dietary changes"
    },
    {
      name: "Maria",
      age: "35-44",
      matchedSymptoms: "Family History, Irregular Eating, Sleep Issues",
      unmatchedSymptoms: "Tingling in Feet",
      riskScore: 45,
      outcome: "Ongoing management with medication",
      intervention: "Metformin + continuous glucose monitoring"
    }
  ];

  // Enhanced physician findings with detailed assessments
  const physicianFindings = {
    overallAssessment: "Patient presents with classical signs of metabolic dysfunction and pre-diabetic state. Immediate intervention required to prevent progression to Type 2 diabetes. Strong familial predisposition combined with current lifestyle factors creates high-risk profile.",
    keyFindings: [
      "HbA1c 8.2% indicates poor glycemic control over past 2-3 months",
      "BMI 28.4 with central adiposity - metabolic syndrome pattern",
      "Blood pressure 142/88 suggests early hypertensive changes",
      "Lipid profile shows diabetic dyslipidemia pattern",
      "Early diabetic retinopathy changes detected on fundoscopy"
    ],
    bodySystemFindings: [
      { system: "Cardiovascular", finding: "Elevated BP, dyslipidemia", risk: "Medium" },
      { system: "Endocrine", finding: "Insulin resistance, pre-diabetes", risk: "High" },
      { system: "Ophthalmologic", finding: "Early retinopathy changes", risk: "Medium" },
      { system: "Neurologic", finding: "Mild peripheral neuropathy symptoms", risk: "Low" },
      { system: "Dermatologic", finding: "Acanthosis nigricans present", risk: "Medium" },
      { system: "Renal", finding: "No current dysfunction", risk: "Low" }
    ]
  };

  // Symptom analysis with NLP confidence scores
  const symptomAnalysis = [
    {
      symptom: "Polyuria (Frequent Urination)",
      confidence: 94,
      riskLevel: "High",
      correlation: "Strong correlation with hyperglycemia",
      timeframe: "3 months"
    },
    {
      symptom: "Polydipsia (Increased Thirst)",
      confidence: 91,
      riskLevel: "High",
      correlation: "Direct response to fluid loss",
      timeframe: "3 months"
    },
    {
      symptom: "Fatigue",
      confidence: 87,
      riskLevel: "Medium",
      correlation: "Related to glucose dysregulation",
      timeframe: "3 months"
    },
    {
      symptom: "Blurred Vision",
      confidence: 82,
      riskLevel: "Medium",
      correlation: "Osmotic lens changes",
      timeframe: "2 months"
    }
  ];

  // Personalized facts based on all data
  const personalizedFacts = [
    "Your family history increases diabetes risk by 2.5x compared to general population",
    "Springfield, MO has 12.8% diabetes prevalence - 40% higher than national average",
    "Your current HbA1c (8.2%) indicates pre-diabetic state requiring immediate intervention",
    "Work-related stress contributes to 78% of your current risk profile",
    "Similar patients with early intervention reduced risk by 58% within 6 months"
  ];

  // Evidence-based treatment goals
  const treatmentGoals = [
    { goal: "Reduce HbA1c to <7%", timeline: "3 months", status: "Priority", priority: "Critical" },
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

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Target className="h-4 w-4 text-green-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
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
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Clinical Decision Summary</h1>
              <p className="text-muted-foreground">
                Suggested actions with supporting evidence. Every item requires physician confirmation.
              </p>
            </div>
          </div>
          <Button 
            onClick={generateInsights} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Refresh summary
              </>
            )}
          </Button>
        </div>

        <PrototypeBanner className="mb-6" />

        {clinicalSummary && (
          <div className="mb-8 space-y-6">
            <ClinicalStatusBanner classification={clinicalSummary.classification} />

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-3 lg:col-span-2">
                <h2 className="text-sm font-medium">Suggested actions</h2>
                {suggestedActions.map((a) => (
                  <SuggestedActionCard
                    key={a.id}
                    action={a}
                    onDecision={async (decision, payload) => {
                      await saveRecommendationDecision(a.id, decision, payload);
                      setSuggestedActions((prev) =>
                        prev.map((x) =>
                          x.id === a.id
                            ? {
                                ...x,
                                status:
                                  decision === "Accept"
                                    ? "Accepted"
                                    : decision === "Modify"
                                      ? "Modified"
                                      : "Dismissed",
                                title: payload?.modifiedTitle || x.title,
                              }
                            : x,
                        ),
                      );
                      toast({ title: `Recommendation ${decision.toLowerCase()}ed`, description: a.title });
                    }}
                  />
                ))}
              </div>
              <div className="space-y-4">
                <DataCompletenessMeter value={clinicalSummary.dataQuality.completeness} />
                <AssessmentConfidence confidence={clinicalSummary.classification.confidence} />
                <MissingDataPanel issues={clinicalSummary.dataQuality.issues} />
                <AuditInformationDrawer audit={clinicalSummary.audit} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {cohort && <CohortUnavailableState cohort={cohort} />}
              {plan && (
                <PatientPlanPreview
                  plan={plan}
                  onApprove={() => setPlan({ ...plan, approvalStatus: "Physician Approved" })}
                  onShare={() => setPlan({ ...plan, approvalStatus: "Shared With Patient" })}
                />
              )}
            </div>
          </div>
        )}



        {/* AI-Powered Similarity Analysis (Real Data) */}
        {analysis && (
          <>
            {/* Risk Score Card - Prominent Display */}
            <Card className="mb-6 border-red-200 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  Diabetes Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg">
                    <div className="text-5xl font-bold" style={{
                      color: (analysis.risk_insights?.risk_score || 0) > 70 ? '#dc2626' :
                             (analysis.risk_insights?.risk_score || 0) > 40 ? '#f59e0b' : '#22c55e'
                    }}>
                      {analysis.risk_insights?.risk_score || 0}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Risk Score</div>
                  </div>
                </div>
                <div className="flex justify-center gap-8 text-sm mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.similarity_score?.toFixed(0) || 0}%
                    </div>
                    <div className="text-muted-foreground">Patient Match</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analysis.matching_factors?.length || 0}
                    </div>
                    <div className="text-muted-foreground">Key Factors</div>
                  </div>
                </div>
                {(analysis.risk_insights?.risk_score || 0) > 50 && (
                  <div className="mt-4 p-3 bg-white rounded-lg border-l-4 border-l-red-500">
                    <p className="text-sm font-medium text-red-900">High Risk Detected</p>
                    <p className="text-xs text-red-700 mt-1">
                      Immediate lifestyle interventions and medical consultation recommended
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Targeted Patient Insights */}
            <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-6 w-6 text-green-600" />
                  Targeted Clinical Insights for This Patient
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Analysis based on patient-specific demographics, symptoms, and matching clinical research
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.similar_patient_profile && (
                  <div className="p-4 bg-white rounded border-l-4 border-l-green-500">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Similar Patient Profile
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {analysis.similar_patient_profile.description}
                    </p>
                    {analysis.similar_patient_profile.outcomes && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <p className="text-xs font-medium text-blue-900">Patient Outcomes:</p>
                        <p className="text-xs text-blue-700">{analysis.similar_patient_profile.outcomes}</p>
                      </div>
                    )}
                    {analysis.similar_patient_profile.key_characteristics && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {analysis.similar_patient_profile.key_characteristics.map((char: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-green-50">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {analysis.matching_factors && analysis.matching_factors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Why This Research Applies to This Patient
                    </h4>
                    <div className="space-y-2">
                      {analysis.matching_factors.map((factor: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white rounded border-l-4 border-l-blue-500">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{factor.factor}</span>
                            <Badge variant={
                              factor.confidence === 'high' ? 'default' : 
                              factor.confidence === 'medium' ? 'secondary' : 
                              'outline'
                            }>
                              {factor.confidence} match
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{factor.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.risk_insights && analysis.risk_insights.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Factors Specific to This Patient
                    </h4>
                    <div className="space-y-2">
                      {analysis.risk_insights.map((risk: any, idx: number) => (
                        <div key={idx} className={`p-3 rounded border-l-4 ${
                          risk.severity === 'high' ? 'bg-red-50 border-l-red-500' :
                          risk.severity === 'medium' ? 'bg-yellow-50 border-l-yellow-500' :
                          'bg-green-50 border-l-green-500'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{risk.risk}</span>
                            <Badge variant={
                              risk.severity === 'high' ? 'destructive' : 
                              risk.severity === 'medium' ? 'secondary' : 
                              'outline'
                            }>
                              {risk.severity} risk
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{risk.evidence}</p>
                          {risk.relevance && (
                            <p className="text-xs text-blue-600 italic">Why relevant: {risk.relevance}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.targeted_insights && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      AI-Generated Targeted Insights
                    </h4>
                    
                    {analysis.targeted_insights.matching_research && (
                      <div className="mb-3 p-2 bg-white rounded">
                        <p className="text-xs font-medium text-purple-900">Research for This Patient Type:</p>
                        <p className="text-xs text-gray-700">{analysis.targeted_insights.matching_research}</p>
                      </div>
                    )}
                    
                    {analysis.targeted_insights.similar_patient_outcomes && (
                      <div className="mb-3 p-2 bg-white rounded">
                        <p className="text-xs font-medium text-purple-900">Similar Patient Outcomes:</p>
                        <p className="text-xs text-gray-700">{analysis.targeted_insights.similar_patient_outcomes}</p>
                      </div>
                    )}
                    
                    {analysis.targeted_insights.demographic_trends && (
                      <div className="p-2 bg-white rounded">
                        <p className="text-xs font-medium text-purple-900">Demographic-Specific Trends:</p>
                        <p className="text-xs text-gray-700">{analysis.targeted_insights.demographic_trends}</p>
                      </div>
                    )}
                  </div>
                )}

                {analysis.examination && (
                  <div className="p-4 bg-white rounded border-2 border-blue-300">
                    <h4 className="font-medium mb-2 text-blue-700">Based on your examination</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {analysis.examination.bmi != null && <Chip label="BMI" value={Number(analysis.examination.bmi).toFixed(1)} flag={analysis.examination.bmi > 30} />}
                      {analysis.examination.hba1c != null && <Chip label="HbA1c" value={`${analysis.examination.hba1c}%`} flag={analysis.examination.hba1c > 6.5} />}
                      {analysis.examination.fasting_glucose != null && <Chip label="Fasting glucose" value={`${analysis.examination.fasting_glucose} mg/dL`} flag={analysis.examination.fasting_glucose > 126} />}
                      {analysis.examination.systolic_bp != null && <Chip label="BP" value={`${analysis.examination.systolic_bp}/${analysis.examination.diastolic_bp ?? '?'}`} flag={analysis.examination.systolic_bp > 140} />}
                      {analysis.examination.ldl != null && <Chip label="LDL" value={`${analysis.examination.ldl}`} flag={analysis.examination.ldl > 130} />}
                      {analysis.examination.hdl != null && <Chip label="HDL" value={`${analysis.examination.hdl}`} flag={analysis.examination.hdl < 40} />}
                    </div>
                    {analysis.model_risk?.contributions?.length > 0 && (
                      <p className="text-xs text-gray-600 mt-3">
                        Top model drivers: {analysis.model_risk.contributions.slice(0,3).map((c: any) => c.label).join(' · ')}
                      </p>
                    )}
                  </div>
                )}

                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div className="p-4 bg-white rounded border-2 border-green-300">
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-green-700">
                      <Stethoscope className="h-4 w-4" />
                      Recommendations Based on Similar Patients
                    </h4>
                    <ul className="space-y-1">
                      {analysis.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Latest Clinical News */}
        {news.length > 0 && (
          <Card className="mb-6 border-indigo-200 bg-indigo-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Latest Diabetes Research & News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded border-l-4 border-l-indigo-500">
                    <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {item.category && (
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      )}
                      {item.published_date && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.published_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Peer Findings */}
        {peerFindings.length > 0 && (
          <Card className="mb-6 border-purple-200 bg-purple-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-purple-600" />
                Peer Physician Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {peerFindings.map((finding) => (
                  <div key={finding.id} className="p-3 bg-white rounded border-l-4 border-l-purple-500">
                    <h4 className="font-medium text-sm mb-1">{finding.finding_title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {finding.finding_description}
                    </p>
                    {finding.outcome_data && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          Outcome Data Available
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Insights Summary */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              AI Clinical Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-red-600">71%</div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-orange-600">89%</div>
                <div className="text-sm text-muted-foreground">Pattern Match</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">58%</div>
                <div className="text-sm text-muted-foreground">Risk Reduction Potential</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground bg-white p-3 rounded border-l-4 border-l-blue-500">
              {aiInsights.riskAnalysis}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* AI-Powered Clinical Insights */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI-Powered Clinical Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Insights generated from physician findings, patient notes, and similar patient data
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Clinical Pattern Recognition</h4>
                  <div className="space-y-2">
                    {aiInsights.clinicalPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Peer Comparison Analysis */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-purple-600" />
                  Similar Patient Cohort Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.peerComparisons.map((comparison, index) => (
                    <div key={index} className="p-4 bg-white rounded border-l-4 border-l-purple-500">
                      <h4 className="font-medium text-purple-900 mb-2">{comparison.cohort}</h4>
                      <div className="space-y-1 text-sm">
                        <div><strong>Risk Factors:</strong> {comparison.riskFactors}</div>
                        <div><strong>Outcomes:</strong> {comparison.outcomes}</div>
                        <div><strong>Effective Interventions:</strong> {comparison.interventions}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment Cards */}
            <div className="grid grid-cols-2 gap-4">
              {riskFactors.map((factor, index) => (
                <Card key={index} className="bg-gradient-to-br from-background to-secondary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <factor.icon className="h-6 w-6 text-primary" />
                      <Badge variant="outline" className={getRiskLevelColor(factor.level)}>
                        {factor.level}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{factor.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-2 w-full rounded-full bg-muted`}>
                        <div 
                          className={`h-2 rounded-full ${factor.color}`}
                          style={{ width: `${factor.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{factor.percentage}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{factor.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Lifestyle Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Lifestyle Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lifestyleFactors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{factor.factor}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{factor.score}%</span>
                          <Badge variant="outline" className={getRiskLevelColor(factor.priority)}>
                            {factor.priority}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={factor.score} className="h-2" />
                      <p className="text-sm text-muted-foreground">{factor.intervention}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Similar Patient Journeys
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Insights from patients with similar profiles and outcomes
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{insight.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{insight.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">Age: {insight.age}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={getRiskLevelColor(insight.riskScore > 50 ? 'high' : insight.riskScore > 30 ? 'medium' : 'low')}>
                          {insight.riskScore}% Risk
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-green-600">Matched:</span> {insight.matchedSymptoms}
                        </div>
                        <div>
                          <span className="font-medium text-orange-600">Different:</span> {insight.unmatchedSymptoms}
                        </div>
                        <div>
                          <span className="font-medium">Outcome:</span> {insight.outcome}
                        </div>
                        <div>
                          <span className="font-medium">Intervention:</span> {insight.intervention}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Physician Findings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Physician Assessment & Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Overall Assessment</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-blue-50 rounded border-l-4 border-l-blue-500">
                      {physicianFindings.overallAssessment}
                    </p>
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
                        <div className="text-xs text-muted-foreground">HIGH RISK</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Probability of developing Type 2 diabetes within 12 months without intervention
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Symptom Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Symptom Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  NLP-powered confidence scoring of reported symptoms
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {symptomAnalysis.map((symptom, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{symptom.symptom}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{symptom.confidence}%</span>
                          <Badge variant="outline" className={getRiskLevelColor(symptom.riskLevel)}>
                            {symptom.riskLevel}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={symptom.confidence} className="h-1 mb-2" />
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>{symptom.correlation}</div>
                        <div>Duration: {symptom.timeframe}</div>
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
                  <Dna className="h-5 w-5" />
                  Personalized Risk Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {personalizedFacts.map((fact, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{fact}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preventive Action Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Preventive Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {preventiveMeasures.map((category, index) => (
                    <div key={index}>
                      <div className={`p-3 rounded-lg ${category.color} mb-3`}>
                        <h4 className="font-medium">{category.category}</h4>
                      </div>
                      <div className="space-y-2">
                        {category.measures.map((measure, measureIndex) => (
                          <div key={measureIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            <span>{measure}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>
      </div>
    </div>
  );
};

function Chip({ label, value, flag }: { label: string; value: string; flag?: boolean }) {
  return (
    <div className={`rounded px-2 py-1 border ${flag ? "border-destructive/40 bg-destructive/5 text-destructive" : "border-border bg-secondary/40"}`}>
      <span className="text-muted-foreground mr-1">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}


export default Recommendations;