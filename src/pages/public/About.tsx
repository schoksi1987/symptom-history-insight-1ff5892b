import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

export default function About() {
  return (
    <PublicLayout
      seo={{
        title: "About",
        description: "About Predict Disease by symptom.ai, a clinical decision-support product focused on Type 2 diabetes screening support.",
        path: "/about",
      }}
    >
      <PageHero title="Helping Primary Care Act Earlier" />
      <PageBody>
        <Section>
          <p>
            Predict Disease started with a simple question: can we help clinicians recognize diabetes
            risk earlier by making the information around the patient easier to understand and act
            on?
          </p>
          <p>
            Healthcare organizations already hold large amounts of patient information. The challenge
            is often connecting the relevant signals at the right time and translating them into a
            reviewable clinical next step.
          </p>
          <p>
            Predict Disease is being developed as a diabetes screening and primary-care intelligence
            platform combining transparent clinical logic with carefully governed AI assistance.
          </p>
          <p>
            Our goal is to help care teams spend less time searching for signals and more time
            understanding the patient who may need attention.
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
