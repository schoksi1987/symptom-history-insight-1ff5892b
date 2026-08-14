import { PublicLayout, PageHero, PageBody, Section } from "@/components/public/PublicLayout";

const SECTIONS: [string, string][] = [
  ["Authenticated access", "Every application route beyond public information pages requires an authenticated, approved account."],
  ["Role-based permissions", "Authorization is granted through explicit roles held in a dedicated roles table, never through a self-selected professional role."],
  ["Least-privilege access", "Accounts and services receive only the privileges required for their function."],
  ["Row-level database security", "Database policies restrict each request to the rows the requesting account is entitled to read or change."],
  ["Auditability", "Approval, rejection, and demo-access changes are written to an append-only audit record with the acting administrator and timestamp."],
  ["Encryption", "Data in transit and at rest is encrypted by the underlying managed infrastructure."],
  ["Separation of demo and real information", "Synthetic demonstration data is never written into real clinical records, and toggling demo access only changes which data source is presented."],
  ["Secrets management", "Credentials and API keys are held in managed secret storage and are never exposed to the browser."],
  ["Monitoring and review", "Application and security scanning is run against the project, and a broader security review is planned as the product matures."],
];

export default function Security() {
  return (
    <PublicLayout>
      <PageHero
        title="Security by design"
        intro={<p>Our approach to protecting access and information. We do not claim security certifications that we have not obtained.</p>}
      />
      <PageBody>
        {SECTIONS.map(([heading, body]) => (
          <Section key={heading} heading={heading}>
            <p>{body}</p>
          </Section>
        ))}
      </PageBody>
    </PublicLayout>
  );
}
