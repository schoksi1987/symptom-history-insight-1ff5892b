import { auth, defineMcp } from "@lovable.dev/mcp-js";
import addPatientNote from "./tools/add-patient-note";
import listPatientNotes from "./tools/list-patient-notes";
import listPatientSymptoms from "./tools/list-patient-symptoms";
import getLatestInsights from "./tools/get-latest-insights";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "predict-disease-mcp",
  title: "Predict Disease MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Predict Disease app. Patients can add between-visit notes, list their tracked symptoms and notes, and read the latest AI risk insight. All tools act as the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [addPatientNote, listPatientNotes, listPatientSymptoms, getLatestInsights],
});
