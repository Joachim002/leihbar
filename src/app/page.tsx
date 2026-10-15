import Link from "next/link";
import Waldrand from "@/components/Waldrand";
import FilterKatalog from "@/components/FilterKatalog";
import { kategorien } from "@/data/gegenstaende";
import { holeVerfuegbareGegenstaende } from "@/lib/gegenstaende";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { kategorie: gewaehlt } = await searchParams;
  // Unbekannte oder doppelte Werte in der Adresse zählen wie „Alle“.
  const aktiv = kategorien.find((kategorie) => kategorie === gewaehlt) ?? null;

  const alle = await holeVerfuegbareGegenstaende();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-12">
      <section aria-labelledby="titel" className="mb-16 max-w-2xl">
        <h1 id="titel" className="mb-5 font-display text-[44px] leading-[1.05] sm:text-7xl">
          Leihen statt kaufen.
        </h1>
        <p className="mb-8 max-w-prose text-lg leading-relaxed text-muted">
          Abendkleid für den Ball, Akkuschrauber fürs WG-Regal, Zelt fürs Festival: Am Campus
          hat es schon jemand. Anbieten, finden, anfragen.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/anbieten"
            className="inline-flex min-h-11 items-center bg-accent px-6 font-medium text-accent-ink transition hover:opacity-90"
          >
            Gegenstand anbieten
          </Link>
          <a
            href="#gegenstaende"
            className="inline-flex min-h-11 items-center font-medium underline underline-offset-4 hover:text-accent"
          >
            Gegenstände ansehen
          </a>
        </div>
      </section>

      <Waldrand kennung="wald-start" className="mb-12 block" />

      <section id="gegenstaende" aria-labelledby="gegenstaende-titel" className="scroll-mt-4">
        <h2 id="gegenstaende-titel" className="mb-6 font-display text-4xl sm:text-5xl">
          Das kannst du ausleihen
        </h2>
        <FilterKatalog gegenstaende={alle} aktiv={aktiv} />
      </section>
    </main>
  );
}
