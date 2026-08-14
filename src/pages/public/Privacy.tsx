import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <PageHero
        title="Privacy"
        intro={
          <p>
            Predict Disease is designed to collect and process information only for authorized
            purposes and according to applicable privacy, security, contractual, and organizational
            requirements. This is prototype policy content, not a claim of certification.
          </p>
        }
      />
      <PageBody>
        <Section heading="Demo environments">
          <Bullets
            items={[
              "Demo environments use synthetic information only.",
              "Demo information is kept separate from real clinical workspaces.",
              "We do not claim HIPAA compliance. Formal technical, administrative, contractual, and operational requirements have not been completed and documented.",
            ]}
          />
        </Section>
        <Section heading="Information collected">
          <Bullets
            items={[
              "Account information such as name, work email, organization, requested professional role, and stated purpose of use.",
              "Application usage and audit records for authorized administrative review.",
              "Clinical information only where a customer has explicitly configured and authorized it.",
            ]}
          />
        </Section>
        <Section heading="Purpose and use">
          <p>
            Information is used to operate the platform, review and approve account access, provide
            support, and improve product quality. We do not sell personal information.
          </p>
        </Section>
        <Section heading="Retention">
          <p>
            Information is retained for as long as an account remains active or as required to meet
            contractual, legal, or operational obligations, and then deleted or de-identified.
          </p>
        </Section>
        <Section heading="Third-party processors">
          <p>
            The platform relies on infrastructure and AI service providers to host data and to
            provide transcription, summarization, and related assistance. These providers process
            information on our instruction.
          </p>
        </Section>
        <Section heading="Security practices">
          <p>
            Access is authenticated and role-based, database access is protected with row-level
            security, secrets are stored in managed secret storage, and administrative actions are
            recorded for audit.
          </p>
        </Section>
        <Section heading="Your rights">
          <p>
            You may request access to, correction of, or deletion of your account information, and
            you may request that your account access be revoked.
          </p>
        </Section>
        <Section heading="Contact">
          <p>
            Privacy questions can be directed to our team through the Support Center or the demo
            request form.
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
