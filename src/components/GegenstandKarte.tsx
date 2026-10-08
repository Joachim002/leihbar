import Image from "next/image";
import Link from "next/link";
import type { Gegenstand } from "@/data/gegenstaende";
import { preisText } from "@/lib/format";

type Props = {
  gegenstand: Gegenstand;
  /** Das erste sichtbare Bild wird vorab geladen. */
  erstes?: boolean;
};

export default function GegenstandKarte({ gegenstand, erstes = false }: Props) {
  const { id, titel, kategorie, besitzer, ort, preisProTag, bild } = gegenstand;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] bg-accent-soft">
        {/* Der Titel steht direkt darunter, deshalb ist der Alt-Text leer. */}
        <Image
          src={bild}
          alt=""
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
          preload={erstes}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm text-muted">{kategorie}</p>
        <h3 className="font-semibold leading-snug">
          {/* Der unsichtbare Bereich (after) macht die ganze Karte anklickbar. */}
          <Link
            href={`/gegenstaende/${id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {titel}
          </Link>
        </h3>
        <p className="font-medium">{preisText(preisProTag)}</p>
        <dl className="mt-auto space-y-1 pt-2 text-sm text-muted">
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
  );
}
