import Link from "next/link";

export default function GegenstandNichtGefunden() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <h1 className="mb-3 text-3xl font-bold">Diesen Gegenstand gibt es nicht</h1>
      <p className="mb-6 max-w-xl text-muted">
        Vielleicht wurde er entfernt, oder die Adresse hat einen Tippfehler.
      </p>
      <Link
        href="/#gegenstaende"
        className="inline-flex min-h-11 items-center rounded-xl bg-accent px-5 font-medium text-white shadow-sm transition hover:opacity-90"
      >
        Zurück zur Liste
      </Link>
    </main>
  );
}
