// Service placeholders. Real clinical analytics will be implemented backend-side.
// All returned data is clearly labeled demonstration data.

import type {
  CohortAnalysis,
  CopilotSuggestion,
  DataQualityResult,
  EvidenceSource,
  ExtractedClinicalFact,
  PatientClinicalSummary,
  PatientPlan,
  PatientQueueEntry,
  RecommendationDecision,
  SuggestedAction,
  TranscriptSegment,
} from "@/types/clinical";

const RULES_VERSION = "rules-placeholder-v0";
const MODEL_VERSION = "model-placeholder-v0";

const delay = <T,>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export async function getPatientClinicalSummary(
  patientId: string,
): Promise<PatientClinicalSummary> {
  return delay({
    classification: {
      patientId,
      status: "Laboratory Values Consistent With Diabetes — Physician Review Required",
      explanation:
        "A recorded laboratory value is in the range typically associated with diabetes. This is not a diagnosis. Physician review and confirmatory testing are required.",
      physicianReviewRequired: true,
      calculatedAt: new Date().toISOString(),
      rulesVersion: RULES_VERSION,
      modelVersion: MODEL_VERSION,
      confidence: "Moderate",
      dataCompleteness: 62,
    },
    evidence: [
      {
        id: "ev-1",
        category: "Laboratory",
        label: "HbA1c",
        observation: "8.2 % (single recorded result, not confirmed)",
        observedAt: "2024-11-04",
        source: "Laboratory",
        verification: "Needs Review",
        strength: "Strong Contributor",
      },
      {
        id: "ev-2",
        category: "Vital",
        label: "Blood pressure",
        observation: "142/88 mmHg",
        observedAt: "2024-11-04",
        source: "Physician Entered",
        verification: "Verified",
        strength: "Moderate Contributor",
      },
      {
        id: "ev-3",
        category: "Symptom",
        label: "Increased thirst and urination",
        observation: "Reported over approximately three months",
        observedAt: "2024-11-04",
        source: "Patient Reported",
        verification: "Unverified",
        strength: "Moderate Contributor",
      },
      {
        id: "ev-4",
        category: "Family History",
        label: "First-degree relative with type 2 diabetes",
        observation: "Father, reported diagnosis in mid-forties",
        observedAt: null,
        source: "Patient Reported",
        verification: "Unverified",
        strength: "Moderate Contributor",
      },
      {
        id: "ev-5",
        category: "Lifestyle or SDOH",
        label: "Irregular meal timing and shift work",
        observation: "Rotating night shifts reported",
        observedAt: "2024-11-04",
        source: "Patient Reported",
        verification: "Unverified",
        strength: "Possible Contributor",
      },
    ],
    dataQuality: {
      patientId,
      completeness: 62,
      issues: [
        {
          id: "dq-1",
          type: "Missing",
          label: "Waist circumference missing",
          detail: "No waist measurement recorded for this encounter.",
          field: "waist_cm",
        },
        {
          id: "dq-2",
          type: "Missing",
          label: "Previous glucose history missing",
          detail: "No prior fasting glucose or HbA1c results are available for comparison.",
        },
        {
          id: "dq-3",
          type: "Conflicting",
          label: "Metformin listed but diabetes diagnosis not recorded",
          detail:
            "An active medication suggests a prior diagnosis that is not present in the problem list.",
        },
        {
          id: "dq-4",
          type: "Conflicting",
          label: "Conflicting glucose values",
          detail: "Fasting glucose 158 mg/dL recorded alongside an earlier value of 76 mg/dL.",
        },
        {
          id: "dq-5",
          type: "Outdated",
          label: "Old laboratory value",
          detail: "Lipid panel is older than 12 months.",
        },
      ],
      requiredFieldsMissing: ["Waist circumference", "Prior glucose history"],
    },
    currentActions: [
      { label: "Review pending", detail: "Awaiting physician review of laboratory findings", at: "Today" },
      { label: "Test requested", detail: "Not requested", at: "—" },
      { label: "Referral created", detail: "None", at: "—" },
      { label: "Follow-up scheduled", detail: "Not scheduled", at: "—" },
      { label: "Patient plan shared", detail: "Draft only", at: "—" },
    ],
    audit: {
      rulesVersion: RULES_VERSION,
      modelVersion: MODEL_VERSION,
      generatedAt: new Date().toISOString(),
      inputsUsed: ["HbA1c", "Blood pressure", "Reported symptoms", "Family history", "Lifestyle intake"],
      missingInputs: ["Waist circumference", "Prior glucose history", "Current lipid panel"],
      physicianReviewStatus: "Not Reviewed",
    },
  });
}

export async function getPatientDataQuality(patientId: string): Promise<DataQualityResult> {
  const summary = await getPatientClinicalSummary(patientId);
  return summary.dataQuality;
}

export async function runClinicalClassification(patientId: string, encounterId?: string) {
  const summary = await getPatientClinicalSummary(patientId);
  return { ...summary.classification, encounterId };
}

export async function getSuggestedActions(
  patientId: string,
  encounterId?: string,
): Promise<SuggestedAction[]> {
  return delay([
    {
      id: "act-1",
      title: "Confirm HbA1c with a repeat laboratory test",
      reason:
        "A single elevated result is not sufficient for a diagnosis; confirmation is required before any clinical conclusion.",
      evidenceSource: "Laboratory — HbA1c 8.2 % (2024-11-04)",
      priority: "Priority",
      status: "Pending Review",
    },
    {
      id: "act-2",
      title: "Review medication list for an unrecorded prior diagnosis",
      reason: "Metformin is listed without a corresponding entry in the problem list.",
      evidenceSource: "Medication list — Metformin 500 mg",
      priority: "Soon",
      status: "Pending Review",
    },
    {
      id: "act-3",
      title: "Request a fasting glucose and current lipid panel",
      reason: "Prior glucose history is missing and the lipid panel is over 12 months old.",
      evidenceSource: "Data completeness check",
      priority: "Soon",
      status: "Pending Review",
    },
    {
      id: "act-4",
      title: "Discuss shift work and meal timing with the patient",
      reason: "Reported rotating night shifts may affect glucose patterns and follow-up planning.",
      evidenceSource: "Lifestyle and Social Context intake",
      priority: "Routine",
      status: "Pending Review",
    },
    {
      id: "act-5",
      title: "Schedule follow-up once confirmatory results return",
      reason: "No follow-up is currently scheduled for this patient.",
      evidenceSource: "Encounter record",
      priority: "Routine",
      status: "Pending Review",
    },
  ]);
}

const decisions: RecommendationDecision[] = [];

export async function saveRecommendationDecision(
  recommendationId: string,
  decision: Omit<RecommendationDecision, "recommendationId" | "decidedAt">,
): Promise<RecommendationDecision> {
  const record: RecommendationDecision = {
    recommendationId,
    decidedAt: new Date().toISOString(),
    ...decision,
  };
  decisions.push(record);
  return delay(record, 60);
}

export async function getTranscript(encounterId?: string): Promise<TranscriptSegment[]> {
  return delay([
    { id: "t1", timestamp: "00:04", speaker: "Physician", text: "What brings you in today?" },
    {
      id: "t2",
      timestamp: "00:09",
      speaker: "Patient",
      text: "I have been very thirsty for a few months and I get up at night to use the bathroom.",
    },
    { id: "t3", timestamp: "00:21", speaker: "Physician", text: "How many times a night, roughly?" },
    { id: "t4", timestamp: "00:25", speaker: "Patient", text: "Two or three times most nights." },
  ]);
}

export async function getCopilotSuggestions(encounterId?: string): Promise<CopilotSuggestion[]> {
  return delay([
    {
      id: "cs-1",
      question: "Has the patient had a glucose or HbA1c test before today?",
      reason: "No prior glucose history is recorded, which limits interpretation of the current result.",
      sourceReference: "Missing data item: prior glucose history",
      status: "Open",
    },
    {
      id: "cs-2",
      question: "Who prescribed the metformin currently listed, and for what indication?",
      reason: "The medication list conflicts with the recorded problem list.",
      sourceReference: "Medication list — Metformin 500 mg",
      status: "Open",
    },
    {
      id: "cs-3",
      question: "Any changes in vision recently?",
      reason: "Reported symptoms may warrant an eye examination referral.",
      sourceReference: "Transcript 00:09 — thirst and nocturia",
      status: "Open",
    },
  ]);
}

export async function getExtractedFacts(encounterId?: string): Promise<ExtractedClinicalFact[]> {
  return delay([
    { id: "f1", type: "Symptom", value: "Increased thirst", sourceSentence: "I have been very thirsty…", status: "Proposed" },
    { id: "f2", type: "Duration", value: "Approximately 3 months", sourceSentence: "…for a few months", status: "Proposed" },
    { id: "f3", type: "Frequency", value: "Nocturia 2–3 times per night", sourceSentence: "Two or three times most nights.", status: "Proposed" },
    { id: "f4", type: "Medication", value: "Metformin 500 mg twice daily", sourceSentence: "Medication list", status: "Proposed" },
    { id: "f5", type: "Family History", value: "Father with type 2 diabetes", sourceSentence: "Intake form", status: "Proposed" },
    { id: "f6", type: "Lifestyle", value: "Rotating night shifts", sourceSentence: "Intake form", status: "Proposed" },
  ]);
}

export async function saveExtractedFactDecision(
  factId: string,
  decision: "Confirmed" | "Edited" | "Rejected",
  editedValue?: string,
) {
  return delay({ factId, decision, editedValue, decidedAt: new Date().toISOString() }, 60);
}

export async function createFollowUpTask(
  patientId: string,
  encounterId: string | undefined,
  input: { title: string; dueDate?: string; note?: string },
) {
  return delay({ id: `task-${Date.now()}`, patientId, encounterId, ...input, status: "Created" }, 60);
}

export async function generatePatientPlan(
  patientId: string,
  encounterId?: string,
): Promise<PatientPlan> {
  return delay({
    patientId,
    encounterId,
    approvalStatus: "Draft",
    whatWasReviewed: [
      "Your recent laboratory results",
      "The symptoms you described today",
      "Your family history and daily routine",
    ],
    whatNeedsAttention: [
      "One blood test result was higher than expected and needs to be repeated to be sure.",
    ],
    agreedNextSteps: [
      "Repeat the blood test as instructed",
      "Bring any previous test results to the next visit",
    ],
    lifestyleGoals: [
      "Try to eat meals at similar times each day",
      "Add a short daily walk where your schedule allows",
    ],
    testingInstructions: [
      "Do not eat or drink anything except water for 8 hours before the fasting test.",
    ],
    followUpDate: null,
    whenToContactClinic: [
      "If you feel very unwell, confused, or unusually drowsy",
      "If thirst or urination becomes much worse",
    ],
  });
}

export async function getCohortAnalysis(patientId: string): Promise<CohortAnalysis> {
  return delay({
    available: false,
    unavailableReason:
      "This deployment does not yet contain a validated longitudinal patient cohort. Cohort outcomes will be shown only when minimum sample size, observation period, outcome definition and privacy requirements are met.",
  });
}

export async function getEvidenceSources(): Promise<EvidenceSource[]> {
  return delay([]);
}

export async function getPhysicianQueue(): Promise<PatientQueueEntry[]> {
  return delay([
    {
      patientId: "A-2024-001",
      name: "Patient #A-2024-001",
      appointmentTime: "09:00",
      status: "Laboratory Values Consistent With Diabetes — Physician Review Required",
      reasonFlagged: "HbA1c requires review",
      dataCompleteness: 62,
      lastLabDate: "2024-11-04",
      actionStatus: "Review pending",
    },
    {
      patientId: "A-2024-014",
      name: "Patient #A-2024-014",
      appointmentTime: "10:30",
      status: "Elevated Screening Priority",
      reasonFlagged: "Family history plus elevated screening score",
      dataCompleteness: 78,
      lastLabDate: "2024-06-12",
      actionStatus: "Test requested",
    },
    {
      patientId: "A-2024-027",
      name: "Patient #A-2024-027",
      appointmentTime: "11:45",
      status: "Insufficient Information",
      reasonFlagged: "Missing required information",
      dataCompleteness: 34,
      lastLabDate: null,
      actionStatus: "Review pending",
    },
    {
      patientId: "A-2024-033",
      name: "Patient #A-2024-033",
      appointmentTime: "14:00",
      status: "Prediabetes",
      reasonFlagged: "Follow-up overdue",
      dataCompleteness: 81,
      lastLabDate: "2024-02-20",
      actionStatus: "Follow-up scheduled",
    },
    {
      patientId: "A-2024-041",
      name: "Patient #A-2024-041",
      appointmentTime: "15:30",
      status: "Elevated Screening Priority",
      reasonFlagged: "Patient reported worsening symptoms",
      dataCompleteness: 57,
      lastLabDate: "2024-09-01",
      actionStatus: "Review pending",
    },
    {
      patientId: "A-2024-052",
      name: "Patient #A-2024-052",
      appointmentTime: "16:15",
      status: "Elevated Screening Priority",
      reasonFlagged: "Fasting glucose requires review",
      dataCompleteness: 69,
      lastLabDate: "2024-10-28",
      actionStatus: "Review pending",
    },
  ]);
}
