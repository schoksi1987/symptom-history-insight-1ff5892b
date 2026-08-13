import { useMemo } from "react";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import * as demoSource from "@/services/clinicalService";
import type {
  CohortAnalysis,
  CopilotSuggestion,
  DataQualityResult,
  EvidenceSource,
  ExtractedClinicalFact,
  PatientClinicalSummary,
  PatientPlan,
  PatientQueueEntry,
  TranscriptSegment,
  SuggestedAction,
} from "@/types/clinical";

/**
 * Single seam between the demo/sample workspace and real accounts.
 * Demo accounts read the existing sample source; real approved accounts read
 * their own persisted data only — which is empty until the backend clinical
 * analytics land, so the pages render empty states.
 */
export interface ClinicalDataSource {
  isDemo: boolean;
  getPatientClinicalSummary: (patientId: string) => Promise<PatientClinicalSummary | null>;
  getPatientDataQuality: (patientId: string) => Promise<DataQualityResult | null>;
  getSuggestedActions: (patientId: string, encounterId?: string) => Promise<SuggestedAction[]>;
  getTranscript: (encounterId?: string) => Promise<TranscriptSegment[]>;
  getCopilotSuggestions: (encounterId?: string) => Promise<CopilotSuggestion[]>;
  getExtractedFacts: (encounterId?: string) => Promise<ExtractedClinicalFact[]>;
  getCohortAnalysis: (patientId: string) => Promise<CohortAnalysis>;
  getEvidenceSources: () => Promise<EvidenceSource[]>;
  getPhysicianQueue: () => Promise<PatientQueueEntry[]>;
  generatePatientPlan: (patientId: string) => Promise<PatientPlan | null>;
  saveRecommendationDecision: typeof demoSource.saveRecommendationDecision;
  saveExtractedFactDecision: typeof demoSource.saveExtractedFactDecision;
  createFollowUpTask: typeof demoSource.createFollowUpTask;
}

const emptySource: Omit<ClinicalDataSource, "isDemo"> = {
  getPatientClinicalSummary: async () => null,
  getPatientDataQuality: async () => null,
  getSuggestedActions: async () => [],
  getTranscript: async () => [],
  getCopilotSuggestions: async () => [],
  getExtractedFacts: async () => [],
  getCohortAnalysis: async () => ({
    available: false,
    unavailableReason:
      "No cohort data is available for this account yet. Cohort analysis appears once validated data has been recorded.",
  }),
  getEvidenceSources: async () => [],
  getPhysicianQueue: async () => [],
  generatePatientPlan: async () => null,
  saveRecommendationDecision: demoSource.saveRecommendationDecision,
  saveExtractedFactDecision: demoSource.saveExtractedFactDecision,
  createFollowUpTask: demoSource.createFollowUpTask,
};

export function useClinicalDataSource(): ClinicalDataSource {
  const { isDemo } = useWorkspace();
  return useMemo<ClinicalDataSource>(
    () =>
      isDemo
        ? {
            isDemo: true,
            getPatientClinicalSummary: demoSource.getPatientClinicalSummary,
            getPatientDataQuality: demoSource.getPatientDataQuality,
            getSuggestedActions: demoSource.getSuggestedActions,
            getTranscript: demoSource.getTranscript,
            getCopilotSuggestions: demoSource.getCopilotSuggestions,
            getExtractedFacts: demoSource.getExtractedFacts,
            getCohortAnalysis: demoSource.getCohortAnalysis,
            getEvidenceSources: demoSource.getEvidenceSources,
            getPhysicianQueue: demoSource.getPhysicianQueue,
            generatePatientPlan: demoSource.generatePatientPlan,
            saveRecommendationDecision: demoSource.saveRecommendationDecision,
            saveExtractedFactDecision: demoSource.saveExtractedFactDecision,
            createFollowUpTask: demoSource.createFollowUpTask,
          }
        : { isDemo: false, ...emptySource },
    [isDemo],
  );
}
