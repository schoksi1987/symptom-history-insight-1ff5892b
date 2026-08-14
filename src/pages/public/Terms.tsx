import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

export default function Terms() {
  return (
    <PublicLayout>
      <PageHero
        title="Terms of Use"
        intro={
          <p>
            These prototype terms govern access to and use of Predict Disease. The product is not
            FDA-cleared, certified, clinically validated, or HIPAA compliant.
          </p>
        }
      />
      <PageBody>
        <Section heading="Authorized use">
          <p>
            Access is granted to approved users for evaluation and authorized clinical
            decision-support workflows only.
          </p>
        </Section>
        <Section heading="Account responsibilities">
          <p>
            You are responsible for the accuracy of your account information, for safeguarding your
            credentials, and for all activity performed under your account.
          </p>
        </Section>
        <Section heading="Prohibited misuse">
          <p>
            You may not share credentials, attempt to bypass access controls, upload information you
            are not authorized to process, reverse engineer the platform, or use it for automated
            diagnosis or treatment.
          </p>
        </Section>
        <Section heading="Intellectual property">
          <p>
            The platform, its content, and its underlying logic remain the property of Predict
            Disease and its licensors.
          </p>
        </Section>
        <Section heading="Product availability">
          <p>
            The platform is provided on an as-available basis and may change, be interrupted, or be
            withdrawn without notice.
          </p>
        </Section>
        <Section heading="Clinical limitations">
          <p>
            Predict Disease supports, and does not replace, professional clinical judgment. It does
            not diagnose disease or prescribe treatment and is not intended for emergency use.
          </p>
        </Section>
        <Section heading="Termination of access">
          <p>
            Access may be suspended or terminated at any time, including where misuse or a security
            concern is identified.
          </p>
        </Section>
        <Section heading="Changes to terms">
          <p>Terms may be updated; continued use after an update constitutes acceptance.</p>
        </Section>
        <Section heading="Contact">
          <p>Questions can be raised through the Support Center.</p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
