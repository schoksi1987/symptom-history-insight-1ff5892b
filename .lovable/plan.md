# Plain-language assessment story, fuller patient preview, and admin login fix

## 1. Fix admin sign-in (blocking issue)

The sign-in form validates the typed password against the new account-creation rules
(12 characters, upper/lower case, number) before it ever contacts the backend, so an
existing account with a shorter password is rejected locally with a validation message.
The admin account `shailpoojachoksi@gmail.com` is email-confirmed and was last used
successfully, so nothing is wrong with the account itself.

Change:
- Sign-in only checks that an email is valid and a password was entered. The strong
  password rules stay on account creation and password reset, where they belong.
- Keep the existing generic failure message so the form never reveals whether an email
  is registered.
- Keep "Forgot password" available for anyone who wants to move to a 12-character
  password.

## 2. Remove AI jargon

Replace machine-facing wording with clinical language everywhere it appears in the
product and public pages:

| Current wording | Replacement |
| --- | --- |
| "NLP analysis", "NLP-powered confidence scoring", robot emoji heading | "Documented symptoms identified from your notes" |
| "AI Clinical Analysis Summary", "AI-powered insights" | "Assessment summary" / "Summary of findings" |
| "Advanced machine learning algorithms analyze..." | "Your responses are compared with established screening criteria and with de-identified patient groups" |
| "k-means clustering" | "comparison group of patients with similar profiles" |
| Brain icons on clinical panels | Clinical icons (stethoscope, clipboard, activity) |

Pages touched: `Recommendations`, `PatientExamination`, `SDOHAssessment`,
`PatientNotesAnalysis`, `PatientHistory`, `MyInsights`, `DiseasePrediction`,
`Dashboard`, `AppHeader`, plus the `Platform`, `ClinicalApproach`, and `ResponsibleAI`
public pages.

Wording that identifies AI-generated content for safety and transparency (for example
"AI-generated suggestions require clinician review" on Responsible AI and Clinical
Evidence) stays — that is a disclosure, not jargon.

## 3. Homepage: show how the assessment is actually produced

Add two new sections between "The problem" and the current "How it works" steps.

**What goes into an assessment** — six input domains, each with concrete examples:

- Clinical: vitals, BMI, blood pressure, labs such as HbA1c and glucose, medications
- Family history: first-degree relatives with type 2 diabetes
- Lifestyle: activity, sleep, diet patterns, tobacco and alcohol use
- Symptoms and observations: what the patient reports and what the clinician documents
- Social determinants (SDOH): food access, transportation, housing stability, cost
  barriers, caregiving load
- Community and geographic context: local access to primary care, pharmacy, and
  food resources

**How the assessment is produced** — a built visual, not a bullet list. A responsive
process graphic renders the four stages left to right on desktop and stacked on mobile,
each stage a numbered card with an icon, a one-line description, and connecting arrows
between them:

```text
 [1] Information         [2] Screening          [3] Similar-patient      [4] Screening
     collected      ->       criteria      ->       comparison      ->       priority
 6 input domains         Published adult        De-identified            Routine /
 feed the record         screening criteria     patients with            Consider /
                         are applied            similar profiles         Prioritize
                                                                         + reasons
```

Two supporting visuals in the same section:

- **Input-domain wheel/grid**: the six domains (clinical, family history, lifestyle,
  symptoms, SDOH, community context) shown as labelled tiles feeding into stage 1, with
  a filled/empty state indicator to show that missing domains are visible, not hidden.
- **Similar-patient comparison graphic**: a simple scatter-style cluster illustration
  where one highlighted marker (the patient) sits inside a group of neutral markers,
  captioned "grouped with de-identified patients who share similar clinical, lifestyle,
  and social profiles." Static SVG built with design tokens — illustrative, no live data.

With short explanations that: the comparison group is built from de-identified records
grouped by similar clinical, lifestyle, and social profiles; similarity is used to
surface patterns worth reviewing, never to make a diagnosis; and the criteria version
and date are recorded with every assessment.


## 4. Rebuild the patient illustration into a complete view

Replace the single narrow preview card in the hero with a fuller, tabbed illustration
of one fictional patient (Jordan Lee, clearly labelled demo data):

- Header: age, sex, last visit, BMI, blood pressure, last HbA1c date, demo badge
- Domain strip: the six input domains with what each contributed for this patient, and
  which ones have no data
- Comparison line: "Grouped with de-identified patients showing similar clinical,
  lifestyle, and social profiles" with what that group commonly needed
- Result panel: screening priority, factors increasing priority, moderating factors,
  missing information, and the suggested next steps a clinician would confirm
- Footer: assessment date, criteria version, and the decision-support disclaimer

The illustration stays static and fictional; nothing about it changes real workflows.

## Technical notes

- Sign-in validation change is confined to the sign-in branch of `src/pages/Auth.tsx`;
  the shared password schema keeps its rules for signup and reset.
- New homepage sections and the expanded preview live in `src/pages/Index.tsx` using the
  existing card, badge, and tabs components and the current navy/teal tokens.
- Jargon replacements are copy-and-icon changes only — no scoring logic, database
  structure, edge functions, or authentication behaviour changes.
