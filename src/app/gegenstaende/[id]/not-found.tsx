import Link from "next/link";

export default function GegenstandNichtGefunden() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <h1 className="mb-3 font-display text-4xl">Diesen Gegenstand gibt es nicht</h1>
      <p className="mb-6 max-w-xl text-muted">
        Vielleicht wurde er entfernt, oder die Adresse hat einen Tippfehler.
      </p>
      <Link
        href="/#gegenstaende"
        className="inline-flex min-h-11 items-center bg-accent px-6 font-medium text-accent-ink transition hover:opacity-90"
      >
        Zurück zur Liste
      </Link>
    </main>
  );
}
