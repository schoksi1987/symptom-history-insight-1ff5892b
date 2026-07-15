import { auth, defineMcp } from "@lovable.dev/mcp-js";
import addPatientNote from "./tools/add-patient-note";
import listPatientNotes from "./tools/list-patient-notes";
import listPatientSymptoms from "./tools/list-patient-symptoms";
import getLatestInsights from "./tools/get-latest-insights";
import getRiskScore from "./tools/get-risk-score";
import recomputeRiskScore from "./tools/recompute-risk-score";
import getSimilarPatients from "./tools/get-similar-patients";
import getSymptomForecast from "./tools/get-symptom-forecast";
import getPopulationMetrics from "./tools/get-population-metrics";
import getPatientExamination from "./tools/get-patient-examination";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "predict-disease-mcp",
  title: "Predict Disease MCP",
  version: "0.3.0",
  instructions:
    "Tools for the Predict Disease app. Patients can log notes/symptoms, retrieve their AI risk insights, get a computed diabetes risk score with feature contributions (now including BMI, HbA1c, glucose, BP, lipids from the latest examination), find similar-patient cohorts, view symptom forecasts, read aggregate population metrics, and fetch their latest clinical examination. All tools act as the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    addPatientNote,
    listPatientNotes,
    listPatientSymptoms,
    getLatestInsights,
    getRiskScore,
    recomputeRiskScore,
    getSimilarPatients,
    getSymptomForecast,
    getPopulationMetrics,
    getPatientExamination,
  ],
});

