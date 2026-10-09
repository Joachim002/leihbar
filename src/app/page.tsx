import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Hand, Recycle, Search } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import GegenstandKarte from "@/components/GegenstandKarte";
import KategorieFilter from "@/components/KategorieFilter";
import { kategorien } from "@/data/gegenstaende";
import { holeVerfuegbareGegenstaende } from "@/lib/gegenstaende";

/** Position in der Einblend-Reihenfolge (siehe `.erscheinen` in globals.css). */
const reihenfolge = (nummer: number) => ({ "--i": nummer }) as CSSProperties;

export default async function Home({ searchParams }: PageProps<"/">) {
  const { kategorie: gewaehlt } = await searchParams;
  // Unbekannte oder doppelte Werte in der Adresse zählen wie „Alle“.
  const aktiv = kategorien.find((kategorie) => kategorie === gewaehlt) ?? null;

  const alle = await holeVerfuegbareGegenstaende();
  const verfuegbare = (alle ?? []).filter((gegenstand) => !aktiv || gegenstand.kategorie === aktiv);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-12 pt-4 sm:block">
      <section className="relative mb-16 overflow-hidden rounded-[2rem] bg-gradient-to-b from-accent-soft via-card to-background px-5 pb-10 pt-12 text-center sm:px-10 sm:pt-16">
        <p
          className="erscheinen mb-5 inline-block rounded-full bg-card px-4 py-1.5 text-sm font-medium shadow-sm"
          style={reihenfolge(0)}
        >
          NDU · Wintersemester 2026
        </p>
        <h1
          className="erscheinen mx-auto mb-5 max-w-3xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl"
          style={reihenfolge(1)}
        >
          Leihen statt kaufen.
        </h1>
        <p
          className="erscheinen mx-auto mb-8 max-w-xl text-lg text-muted sm:text-xl"
          style={reihenfolge(2)}
        >
          Abendkleid für den Ball, Akkuschrauber fürs WG-Regal, Zelt fürs Festival – am
          Campus hat es schon jemand. Anbieten, finden, anfragen.
        </p>
        <div
          className="erscheinen mb-10 flex flex-wrap justify-center gap-3"
          style={reihenfolge(3)}
        >
          <a
            href="#gegenstaende"
            className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 font-medium text-white shadow-sm transition hover:opacity-90"
          >
            Gegenstände ansehen
          </a>
          <Link
            href="/anbieten"
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-6 font-medium transition hover:bg-accent-soft"
          >
            Gegenstand anbieten
          </Link>
        </div>

        {/* Dekorative Fotos: der Titel der Gegenstände steht weiter unten, deshalb leerer Alt-Text. */}
        <div className="mx-auto grid max-w-3xl items-end gap-4 sm:grid-cols-[1fr_1.5fr_1fr]">
          <div
            className="erscheinen relative hidden aspect-[3/4] overflow-hidden rounded-3xl shadow-lg sm:block"
            style={reihenfolge(5)}
          >
            <Image
              src="/gegenstaende/akkuschrauber.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 200px, 0px"
              className="object-cover"
            />
          </div>
          <div
            className="erscheinen relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl sm:aspect-[4/5]"
            style={reihenfolge(4)}
          >
            <Image
              src="/gegenstaende/abendkleid.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 420px, 100vw"
              className="object-cover"
              preload
            />
          </div>
          <div
            className="erscheinen relative hidden aspect-[3/4] overflow-hidden rounded-3xl shadow-lg sm:block"
            style={reihenfolge(6)}
          >
            <Image
              src="/gegenstaende/campingzelt.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 200px, 0px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section
        aria-label="Was Leihbar kann"
        className="order-last mb-16 grid gap-4 sm:order-none sm:grid-cols-3"
      >
        <FeatureCard
          icon={Search}
          titel="Alles an einem Ort"
          text="Was andere am Campus verleihen – von Mode über Möbel bis Technik, ohne Herumfragen in Chats."
        />
        <FeatureCard
          icon={Hand}
          titel="Mit einem Klick anfragen"
          text="Besitzer*innen sehen sofort, wer etwas ausleihen möchte. Kein Hin und Her mehr."
        />
        <FeatureCard
          icon={Recycle}
          titel="Leihen statt kaufen"
          text="Für einmal kaufen lohnt sich selten. Leihen spart Geld und Platz in der WG."
        />
      </section>

      <section id="gegenstaende" aria-labelledby="gegenstaende-titel" className="scroll-mt-4">
        <h2
          id="gegenstaende-titel"
          className="mb-6 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Das kannst du ausleihen
        </h2>
        <KategorieFilter aktiv={aktiv} />
        {verfuegbare.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {verfuegbare.map((gegenstand, index) => (
              <li
                key={gegenstand.id}
                className="erscheinen"
                style={reihenfolge(5 + Math.min(index, 6))}
              >
                <GegenstandKarte gegenstand={gegenstand} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-muted">
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
