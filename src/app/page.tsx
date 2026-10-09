import Link from "next/link";
import KategorieFilter from "@/components/KategorieFilter";
import Standplan from "@/components/Standplan";
import { kategorien } from "@/data/gegenstaende";
import { holeVerfuegbareGegenstaende } from "@/lib/gegenstaende";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { kategorie: gewaehlt } = await searchParams;
  // Unbekannte oder doppelte Werte in der Adresse zählen wie „Alle“.
  const aktiv = kategorien.find((kategorie) => kategorie === gewaehlt) ?? null;

  const alle = await holeVerfuegbareGegenstaende();
  const verfuegbare = (alle ?? []).filter((gegenstand) => !aktiv || gegenstand.kategorie === aktiv);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-8">
      <section aria-labelledby="titel" className="mb-8 max-w-2xl">
        <h1 id="titel" className="mb-4 font-display text-[52px] leading-[0.95] sm:text-7xl">
          Leihen statt kaufen.
        </h1>
        <p className="mb-5 max-w-prose text-lg leading-snug">
          Abendkleid für den Ball, Akkuschrauber fürs WG-Regal, Zelt fürs Festival: Am Campus
          hat es schon jemand. Anbieten, finden, anfragen.
        </p>
        <div className="absperrband flex flex-wrap gap-3 p-3">
          <Link
            href="/anbieten"
            className="inline-flex min-h-11 items-center bg-foreground px-5 font-bold text-accent-ink transition hover:bg-accent-soft hover:text-foreground"
          >
            Gegenstand anbieten
          </Link>
          <a
            href="#gegenstaende"
            className="inline-flex min-h-11 items-center bg-background px-5 font-bold transition hover:bg-accent-soft"
          >
            Gegenstände ansehen
          </a>
        </div>
      </section>

      <section id="gegenstaende" aria-labelledby="gegenstaende-titel" className="scroll-mt-4">
        <h2 id="gegenstaende-titel" className="mb-4 font-display text-3xl sm:text-4xl">
          Das kannst du ausleihen
        </h2>
        <KategorieFilter aktiv={aktiv} />
        {verfuegbare.length > 0 ? (
          <Standplan ueberschrift="h3" eintraege={verfuegbare.map((gegenstand) => ({ gegenstand }))} />
        ) : (
          <p className="border-2 border-2 border-dashed border-border bg-card p-8 text-center text-muted">
            {alle === null
              ? "Die Gegenstände lassen sich gerade nicht laden. Bitte versuch es gleich noch einmal."
              : aktiv
              ? `In der Kategorie „${aktiv}“ ist gerade nichts zum Ausleihen da. Wähle oben „Alle“, um alles zu sehen.`
                : "Gerade ist nichts zum Ausleihen da. Biete doch selbst etwas an."}
          </p>
        )}
      </section>
    </main>
  );
}
