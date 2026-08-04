// Frontend data contracts for Predict Disease — Diabetes Screening and Primary Care Copilot
// These are UI-facing placeholders. Real clinical analytics are implemented backend-side.

export type ClinicalStatus =
  | "Known Diabetes"
  | "Laboratory Values Consistent With Diabetes — Physician Review Required"
  | "Prediabetes"
  | "Elevated Screening Priority"
  | "No Elevated Risk Currently Identified"
  | "Insufficient Information";

export type ContributorStrength =
  | "Strong Contributor"
  | "Moderate Contributor"
  | "Possible Contributor"
  | "Protective Factor"
  | "Insufficient Information";

export type DataSource =
  | "Patient Reported"
  | "Physician Entered"
  | "Laboratory"
  | "Imported";

export type VerificationStatus =
  | "Verified"
  | "Unverified"
  | "Needs Review"
  | "Conflicting";

export type EvidenceCategory =
  | "Laboratory"
  | "Vital"
  | "Symptom"
  | "Family History"
  | "Lifestyle or SDOH";

export type ActionPriority = "Routine" | "Soon" | "Priority";

export type DecisionType = "Accept" | "Modify" | "Dismiss";

export interface ClinicalClassification {
  patientId: string;
  encounterId?: string;
  status: ClinicalStatus;
  explanation: string;
  physicianReviewRequired: boolean;
  calculatedAt: string;
  rulesVersion: string;
  modelVersion: string;
  confidence: "High" | "Moderate" | "Low" | "Insufficient Information";
  dataCompleteness: number; // 0-100
}

export interface SupportingEvidence {
  id: string;
  category: EvidenceCategory;
  label: string;
  observation: string;
  observedAt: string | null;
  source: DataSource;
  verification: VerificationStatus;
  strength: ContributorStrength;
}

export interface DataQualityIssue {
  id: string;
  type: "Missing" | "Conflicting" | "Outdated";
  label: string;
  detail: string;
  field?: string;
}

export interface DataQualityResult {
  patientId: string;
  completeness: number; // 0-100
  issues: DataQualityIssue[];
  requiredFieldsMissing: string[];
}

export interface RiskFactorResult {
  id: string;
  factor: string;
  strength: ContributorStrength;
  rationale: string;
  source: DataSource;
}

export interface SuggestedAction {
  id: string;
  title: string; // must begin with Consider / Review / Confirm / Discuss / Request / Refer / Schedule
  reason: string;
  evidenceSource: string;
  priority: ActionPriority;
  status: "Pending Review" | "Accepted" | "Modified" | "Dismissed";
}

export interface RecommendationDecision {
  recommendationId: string;
  decision: DecisionType;
  rationale?: string;
  modifiedTitle?: string;
  decidedAt: string;
  decidedBy?: string;
}

export interface TranscriptSegment {
  id: string;
  timestamp: string; // mm:ss
  speaker: "Physician" | "Patient";
  text: string;
}

export interface ExtractedClinicalFact {
  id: string;
  type:
    | "Symptom"
    | "Duration"
    | "Frequency"
    | "Severity"
    | "Medication"
    | "Family History"
    | "Lifestyle"
    | "SDOH";
  value: string;
  sourceSentence?: string;
  status: "Proposed" | "Confirmed" | "Edited" | "Rejected";
}

export interface CopilotSuggestion {
  id: string;
  question: string;
  reason: string;
  sourceReference: string;
  status: "Open" | "Asked" | "Dismissed";
}

export interface CohortAnalysis {
  available: boolean;
  cohortSize?: number;
  matchingCriteria?: string[];
  matchedCharacteristics?: number;
  observationPeriod?: string;
  outcomeDefinition?: string;
  outcomeRate?: number;
  confidenceInterval?: string;
  dataSource?: string;
  modelVersion?: string;
  unavailableReason?: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  publisher: string;
  publicationDate: string;
  studyType: string;
  population: string;
  sampleSize: string;
  url: string;
  relevance: string;
  strength: "High" | "Moderate" | "Limited";
}

export interface PatientPlan {
  patientId: string;
  encounterId?: string;
  approvalStatus: "Draft" | "Physician Approved" | "Shared With Patient";
  whatWasReviewed: string[];
  whatNeedsAttention: string[];
  agreedNextSteps: string[];
  lifestyleGoals: string[];
  testingInstructions: string[];
  followUpDate: string | null;
  whenToContactClinic: string[];
}

export interface AuditInformation {
  rulesVersion: string;
  modelVersion: string;
  generatedAt: string;
  inputsUsed: string[];
  missingInputs: string[];
  physicianReviewStatus: "Not Reviewed" | "In Review" | "Reviewed";
}

export interface PatientQueueEntry {
  patientId: string;
  name: string;
  appointmentTime: string;
  status: ClinicalStatus;
  reasonFlagged: string;
  dataCompleteness: number;
  lastLabDate: string | null;
  actionStatus:
    | "Review pending"
    | "Test requested"
    | "Referral created"
    | "Follow-up scheduled"
    | "Patient plan shared";
}

export interface PatientClinicalSummary {
  classification: ClinicalClassification;
  evidence: SupportingEvidence[];
  dataQuality: DataQualityResult;
  currentActions: { label: string; detail: string; at: string }[];
  audit: AuditInformation;
}

export const DEMO_DATA_NOTICE =
  "Demonstration data — not for clinical use.";
