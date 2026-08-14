import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <PageHero title="Helping primary care act earlier." />
      <PageBody>
        <Section>
          <p>
            Predict Disease began with a simple question: can we help clinicians recognize
            diabetes-related signals earlier by making the information around the patient easier to
            understand and act on?
          </p>
          <p>
            Healthcare organizations already collect enormous amounts of information. The challenge
            is often connecting the relevant information at the right time and translating it into a
            reviewable clinical next step.
          </p>
          <p>
            Predict Disease is being developed as a diabetes screening and primary-care intelligence
            platform combining structured clinical reasoning with carefully governed AI assistance.
          </p>
          <p>
            Our goal is to help clinicians spend less time searching for signals and more time
            understanding the patient in front of them.
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
