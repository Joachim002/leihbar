import Link from "next/link";
import type { Gegenstand } from "@/data/gegenstaende";
import GegenstandBild from "@/components/GegenstandBild";
import type { AnfrageStatus } from "@/lib/anfragen";
import { preisText } from "@/lib/format";

type Props = {
  gegenstand: Gegenstand;
  /** Ebene der Überschrift: unter einem h2 (Startseite) h3, direkt unter dem h1 h2. */
  ueberschrift?: "h2" | "h3";
  /** Antwort auf die Anfrage der angemeldeten Person (nur auf „Meine Anfragen“). */
  status?: AnfrageStatus;
};

export default function GegenstandKarte({ gegenstand, ueberschrift: Ueberschrift = "h3", status }: Props) {
  const { id, titel, kategorie, besitzer, ort, preisProTag, bild } = gegenstand;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-accent-soft">
        {/* Der Titel steht direkt darunter, deshalb ist der Alt-Text leer. */}
        <GegenstandBild
          bild={bild}
          alt=""
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
          className="transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-sm text-muted">{kategorie}</p>
        {status && (
          <p className="text-sm font-medium">
            <span className="text-muted">Status: </span>
            {status}
          </p>
        )}
        <Ueberschrift className="font-display text-lg font-bold leading-snug">
          {/* Der unsichtbare Bereich (after) macht die ganze Karte anklickbar. */}
          <Link
            href={`/gegenstaende/${id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {titel}
          </Link>
        </Ueberschrift>
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
