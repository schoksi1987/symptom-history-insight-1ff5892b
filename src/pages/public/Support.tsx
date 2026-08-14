import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PublicLayout, PageHero, PageBody, Section, Bullets } from "@/components/public/PublicLayout";
import { SUPPORT_EMAIL } from "@/content/sources";
import { z } from "zod";

const TOPICS = [
  {
    heading: "Getting started",
    items: ["Workspace", "Patient queue", "Assessments", "Demo mode", "Clinical summaries"],
  },
  {
    heading: "Account and access",
    items: ["Pending approval", "Declined access", "Sign-in issues", "Password reset", "Demo access"],
  },
  {
    heading: "Clinical workflow",
    items: [
      "Patient screening workflow",
      "Examinations",
      "Lifestyle and social context",
      "Screening-priority results",
      "Clinician review actions",
    ],
  },
  {
    heading: "Technical issues",
    items: ["Missing data", "Application error", "Incorrect page state", "Integration question"],
  },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  subject: z.string().trim().min(1, "Please enter a subject").max(150),
  message: z.string().trim().min(10, "Please describe your request in at least 10 characters").max(2000),
});

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    const { name, email, subject, message } = parsed.data;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      `[Predict Disease support] ${subject}`
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <PublicLayout
      seo={{
        title: "Support & Contact",
        description:
          "Contact the Predict Disease by symptom.ai team for help with accounts, the clinical demo, assessments, or implementation questions.",
        path: "/support",
      }}
    >
      <PageHero
        title="Support & Contact"
        intro={
          <p>
            Reach the team directly at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline underline-offset-4">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        }
      />
      <PageBody>
        <Section heading="Send us a message">
          {sent ? (
            <Alert>
              <AlertDescription>
                Your email client has been opened with your message. If nothing opened, email us
                directly at{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-4">
                  {SUPPORT_EMAIL}
                </a>
                . We typically reply within two business days.
              </AlertDescription>
            </Alert>
          ) : (
            <Card className="p-6">
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="support-name">Your name</Label>
                    <Input
                      id="support-name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Email address</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-subject">Subject</Label>
                  <Input
                    id="support-subject"
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-message">How can we help?</Label>
                  <Textarea
                    id="support-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Please do not include patient-identifying information in your message.
                  </p>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit">Send message</Button>
              </form>
            </Card>
          )}
        </Section>

        {TOPICS.map((t) => (
          <Section key={t.heading} heading={t.heading}>
            <Bullets items={t.items} />
          </Section>
        ))}

        <Section heading="Product feedback">
          <p>
            Predict Disease is actively evolving. Feedback from clinicians, care teams, and
            healthcare organizations shapes the product — send it to{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline underline-offset-4">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </PageBody>
    </PublicLayout>
  );
}
