import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Meine Anfragen" };

// Der Schutz (Weiterleitung zur Anmeldung) liegt in src/proxy.ts.
// Die eigentliche Liste kommt mit Issue 7.
export default function MeineAnfragenSeite() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <h1 className="mb-3 font-display text-4xl font-extrabold tracking-tight">Meine Anfragen</h1>
      <p className="mb-6 max-w-xl text-muted">
        Hier erscheinen bald deine Anfragen. Bis dahin: Stöbere in den Gegenständen.
      </p>
      <Link
        href="/#gegenstaende"
        className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 font-medium text-white shadow-sm transition hover:opacity-90"
      >
        Zur Liste
      </Link>
    </main>
  );
}
