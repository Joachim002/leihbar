import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GegenstandBild from "@/components/GegenstandBild";
import { holeGegenstand } from "@/lib/gegenstaende";
import AnfrageBereich from "@/components/AnfrageBereich";
import AnfragendeListe from "@/components/AnfragendeListe";
import { holeAnfrageStand, holeAnfragende } from "@/lib/anfragen";
import { preisText } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/gegenstaende/[id]">): Promise<Metadata> {
  const { id } = await params;
  const gegenstand = await holeGegenstand(id);
  return { title: gegenstand ? gegenstand.titel : "Nicht gefunden" };
}

export default async function GegenstandSeite({
  params,
}: PageProps<"/gegenstaende/[id]">) {
  const { id } = await params;
  const gegenstand = await holeGegenstand(id);

  if (!gegenstand) {
    notFound();
  }

  const { titel, kategorie, beschreibung, besitzer, ort, preisProTag, verfuegbar, bild } =
    gegenstand;
  const anfrage = await holeAnfrageStand(gegenstand.id);
  const anfragende = anfrage.eigener ? await holeAnfragende(gegenstand.id) : null;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Link
        href="/#gegenstaende"
        className="mb-6 inline-flex min-h-11 items-center gap-2 font-medium underline-offset-4 hover:underline"
      >
        <ArrowLeft size={20} strokeWidth={1.75} />
        Zurück zur Liste
      </Link>

      <article className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="relative aspect-[4/3] overflow-hidden border border-border bg-accent-soft">
          <GegenstandBild
            bild={bild}
            alt={titel}
            sizes="(min-width: 768px) 480px, 100vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">{kategorie}</p>
          <h1 className="font-display text-4xl leading-none">{titel}</h1>
          <p className="text-xl font-medium">{preisText(preisProTag)}</p>
          {!verfuegbar && (
            <p className="bg-accent-soft px-4 py-3">
              Dieser Gegenstand ist gerade verliehen.
            </p>
          )}
          {/* Am Handy bleibt der Bereich am unteren Rand sichtbar, ohne zu scrollen. */}
          <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-background px-4 py-3 md:static md:mx-0 md:border-0 md:p-0">
            <AnfrageBereich itemId={gegenstand.id} verfuegbar={verfuegbar} {...anfrage} />
          </div>
          <p className="leading-relaxed">{beschreibung}</p>
          <dl className="space-y-1 text-muted">
            <div className="flex gap-1">
              <dt>Ort:</dt>
              <dd>{ort}</dd>
            </div>
            <div className="flex gap-1">
              <dt>Verleiht:</dt>
              <dd>{besitzer}</dd>
            </div>
          </dl>
        </div>
      </article>

      {anfrage.eigener && <AnfragendeListe itemId={gegenstand.id} anfragende={anfragende} />}
    </main>
  );
}
