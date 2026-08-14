import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { DemoRequestProvider } from "@/components/public/DemoRequestContext";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoRequestProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <PublicHeader />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </DemoRequestProvider>
  );
}

export function PageHero({
  title,
  intro,
}: {
  title: string;
  intro?: React.ReactNode;
}) {
  return (
    <section className="border-b bg-gradient-to-br from-orange-100 via-orange-50 to-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold leading-tight lg:text-5xl">{title}</h1>
        {intro && <div className="mt-6 space-y-4 text-lg text-muted-foreground">{intro}</div>}
      </div>
    </section>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">{children}</div>
  );
}

export function Section({
  heading,
  children,
}: {
  heading?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      {heading && <h2 className="text-2xl font-semibold">{heading}</h2>}
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-inside list-disc space-y-2 text-muted-foreground">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}
