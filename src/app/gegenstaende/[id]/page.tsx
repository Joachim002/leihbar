import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { gegenstaende } from "@/data/gegenstaende";
import { preisText } from "@/lib/format";

function findeGegenstand(id: string) {
  return gegenstaende.find((gegenstand) => gegenstand.id === id);
}

export function generateStaticParams() {
  return gegenstaende.map((gegenstand) => ({ id: gegenstand.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/gegenstaende/[id]">): Promise<Metadata> {
  const { id } = await params;
  const gegenstand = findeGegenstand(id);
  return { title: gegenstand ? gegenstand.titel : "Nicht gefunden" };
}

export default async function GegenstandSeite({
  params,
}: PageProps<"/gegenstaende/[id]">) {
  const { id } = await params;
  const gegenstand = findeGegenstand(id);

  if (!gegenstand) {
    notFound();
  }

  const { titel, kategorie, beschreibung, besitzer, ort, preisProTag, verfuegbar, bild } =
    gegenstand;

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
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-accent-soft">
          <Image
            src={bild}
            alt={titel}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
            preload
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">{kategorie}</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">{titel}</h1>
          <p className="text-xl font-medium">{preisText(preisProTag)}</p>
          {!verfuegbar && (
            <p className="rounded-xl bg-accent-soft px-4 py-3">
              Dieser Gegenstand ist gerade verliehen.
            </p>
          )}
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
    </main>
  );
}
