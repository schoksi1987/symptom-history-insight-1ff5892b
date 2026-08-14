import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

export default function MedicalDisclaimer() {
  return (
    <PublicLayout>
      <PageHero title="Important Medical Information" />
      <PageBody>
        <Section>
          <p>
            Predict Disease is a clinical decision-support prototype intended to assist qualified
            healthcare professionals in reviewing information relevant to diabetes screening and
            care.
          </p>
          <p>
            Predict Disease does not independently establish a medical diagnosis, prescribe
            treatment, or replace professional medical judgment.
          </p>
          <p>
            Information generated or summarized by the platform may be incomplete or incorrect and
            must be reviewed in the context of the patient's complete clinical circumstances.
          </p>
          <p className="font-medium text-foreground">
            The platform is not intended for emergency medical use.
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
