import { Card } from "@/components/ui/card";
import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";
import { SUPPORT_EMAIL } from "@/content/sources";
import { Link } from "react-router-dom";

const PRIORITY_LEVELS = [
  {
    level: "Routine",
    meaning:
      "Available information does not indicate a need to prioritize Type 2 diabetes screening ahead of the patient's normal preventive-care schedule.",
  },
  {
    level: "Consider Screening",
    meaning:
      "One or more factors suggest that screening may be appropriate. Clinical review is recommended alongside applicable guidelines.",
  },
  {
    level: "Prioritize Screening",
    meaning:
      "Multiple contributing factors are present. Based on the information available, this patient may benefit from prioritized clinical review for Type 2 diabetes screening.",
  },
];

export default function ImplementationGuide() {
  return (
    <PublicLayout
      seo={{
        title: "Implementation Guide",
        description:
          "How to use Predict Disease by symptom.ai: intended use, required patient information, assessment workflow, interpreting screening priority, data handling, limitations, and support.",
        path: "/implementation-guide",
      }}
    >
      <PageHero
        title="Implementation Guide"
        intro={
          <p>
            How to introduce Predict Disease by symptom.ai into a primary-care workflow, what
            information it needs, and how to interpret what it returns.
          </p>
        }
      />
      <PageBody>
        <Section heading="Intended use">
          <p>
            Predict Disease is clinical decision support focused on identifying patients who may
            benefit from Type 2 diabetes screening. It is not a diagnostic tool, not a general
            symptom checker, and not a replacement for physician judgment.
          </p>
          <p>
            This assessment provides clinical decision support and does not diagnose Type 2 diabetes
            or replace professional medical judgment.
          </p>
        </Section>

        <Section heading="Target users">
          <Bullets
            items={[
              "Primary-care physicians",
              "Nurses and care managers",
              "Population-health teams",
              "Clinical informatics teams",
              "Healthcare organizations evaluating preventive-care workflows",
            ]}
          />
          <p>
            Patients may review shared recommendations and reports through their own secure access.
            Clinical interpretation belongs to qualified healthcare professionals.
          </p>
        </Section>

        <Section heading="Required and optional patient information">
          <p>Required to produce a meaningful screening priority:</p>
          <Bullets items={["Age", "Sex", "Height and weight or BMI", "Presenting symptoms or reason for review"]} />
          <p>Optional but strongly recommended — each improves completeness and confidence:</p>
          <Bullets
            items={[
              "Fasting glucose or HbA1c",
              "Blood pressure and lipid values",
              "Medical history and current diagnoses",
              "Family history of type 2 diabetes",
              "Current medications",
              "Lifestyle and activity information",
              "Social determinants of health, including food access, transportation, housing, and access to care",
            ]}
          />
        </Section>

        <Section heading="Assessment workflow">
          <Bullets
            items={[
              "1. Open the clinician dashboard and select or add a patient.",
              "2. Review the patient overview.",
              "3. Complete the clinical examination or assessment steps.",
              "4. Complete the SDOH assessment.",
              "5. Review the screening-priority result and its supporting evidence.",
              "6. Review recommendations and record follow-up.",
              "7. Share a patient-facing report where appropriate.",
            ]}
          />
          <p>
            The assessment is organized into steps with visible completion progress. You can move
            backward at any point without losing entered information.
          </p>
        </Section>

        <Section heading="How to interpret screening-priority levels">
          <div className="grid gap-4">
            {PRIORITY_LEVELS.map((p) => (
              <Card key={p.level} className="p-5">
                <h3 className="font-semibold text-foreground">{p.level}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.meaning}</p>
              </Card>
            ))}
          </div>
          <p>
            A priority level is not a probability. Predict Disease does not present a percentage as a
            patient's likelihood of developing diabetes.
          </p>
        </Section>

        <Section heading="Confidence and completeness">
          <p>
            <strong className="text-foreground">Data completeness</strong> reflects how much of the
            expected clinical, family-history, lifestyle, and social information is present for the
            patient.
          </p>
          <p>
            <strong className="text-foreground">Assessment confidence</strong> reflects how strongly
            the available information supports the priority level. Low completeness lowers
            confidence, and low-confidence results should be treated as a prompt to gather more
            information rather than as a conclusion.
          </p>
        </Section>

        <Section heading="Missing-data and conflicting-data handling">
          <Bullets
            items={[
              "Missing information is listed explicitly rather than silently assumed to be normal.",
              "Stale values are flagged with the date they were recorded.",
              "Conflicting entries — for example a documented diagnosis that disagrees with a recorded laboratory value — are surfaced for clinician resolution rather than automatically reconciled.",
              "Every result records the rules or model version applied and the assessment timestamp.",
            ]}
          />
        </Section>

        <Section heading="Clinical disclaimer">
          <Card className="p-5 text-sm">
            Predict Disease organizes relevant information and highlights factors that may support
            Type 2 diabetes screening. Results should be reviewed by a qualified healthcare
            professional alongside the patient's complete medical history, current clinical
            condition, and applicable screening guidelines.
          </Card>
        </Section>

        <Section heading="Privacy and security considerations">
          <Bullets
            items={[
              "Access requires an approved account; new accounts are reviewed by an administrator.",
              "Demo workspaces use fictional patients and are kept separate from real clinical workspaces.",
              "Do not enter real patient-identifying information into the demo.",
              "Production use involving identifiable health information requires appropriate security, privacy, contractual, clinical, and regulatory review by your organization.",
            ]}
          />
          <p>
            See the{" "}
            <Link to="/privacy" className="text-primary underline underline-offset-4">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/terms" className="text-primary underline underline-offset-4">
              Terms of Use
            </Link>
            .
          </p>
        </Section>

        <Section heading="Current product limitations">
          <Bullets
            items={[
              "No EHR integration or interoperability capability is available today.",
              "No clinical validation study, outcome study, or regulatory clearance exists for this product.",
              "The initial clinical focus is Type 2 diabetes screening support only.",
              "Results depend entirely on the information entered; incomplete records produce low-confidence assessments.",
              "The product is intended for evaluation workflows rather than production clinical deployment.",
            ]}
          />
        </Section>

        <Section heading="Support and contact">
          <p>
            Questions about implementation, evaluation, or account access can be sent to{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline underline-offset-4">
              {SUPPORT_EMAIL}
            </a>
            , or submitted from the{" "}
            <Link to="/support" className="text-primary underline underline-offset-4">
              support page
            </Link>
            .
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
