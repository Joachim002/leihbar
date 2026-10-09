import Link from "next/link";
import type { Gegenstand } from "@/data/gegenstaende";
import GegenstandBild from "@/components/GegenstandBild";
import type { AnfrageStatus } from "@/lib/anfragen";
import { preisText } from "@/lib/format";

type Props = {
  gegenstand: Gegenstand;
  /** Standnummer auf dem Plan. */
  nummer: number;
  /** Ebene der Überschrift: unter einem h2 (Startseite) h3, direkt unter dem h1 h2. */
  ueberschrift?: "h2" | "h3";
  /** Antwort auf die Anfrage der angemeldeten Person (nur auf „Meine Anfragen“). */
  status?: AnfrageStatus;
};

/** Ein Stand auf dem Plan: das Foto füllt das Rechteck, ein Schild trägt Nummer, Titel und Preis. */
export default function GegenstandKarte({
  gegenstand,
  nummer,
  ueberschrift: Ueberschrift = "h3",
  status,
}: Props) {
  const { id, titel, kategorie, besitzer, ort, preisProTag, bild } = gegenstand;

  return (
    <article className="group relative h-full overflow-hidden bg-accent-soft">
      <div className="absolute inset-0">
        {/* Der Titel steht direkt auf dem Schild, deshalb ist der Alt-Text leer. */}
        <GegenstandBild
          bild={bild}
          alt=""
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
          className="transition duration-500 group-hover:scale-105"
        />
      </div>
      {status && (
        <p className="absolute left-0 top-0 bg-foreground px-2 py-1 text-sm font-semibold text-accent-ink">
          Status: {status}
        </p>
      )}
      <div className="absolute bottom-0 left-0 right-2 flex items-stretch">
        <p className="flex min-w-9 items-center justify-center bg-accent-ink px-2 font-display text-lg text-foreground">
          <span className="sr-only">Stand </span>
          {nummer}
        </p>
        <div className="min-w-0 bg-accent px-2.5 py-1.5 text-accent-ink">
          <Ueberschrift className="text-base font-bold leading-tight">
            {/* Der unsichtbare Bereich (after) macht die ganze Fläche anklickbar. */}
            <Link
              href={`/gegenstaende/${id}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {titel}
            </Link>
          </Ueberschrift>
          <p className="text-sm font-semibold">{preisText(preisProTag)}</p>
        </div>
      </div>
      <dl className="sr-only">
        <dt>Kategorie:</dt>
        <dd>{kategorie}</dd>
        <dt>Ort:</dt>
        <dd>{ort}</dd>
        <dt>Verleiht:</dt>
        <dd>{besitzer}</dd>
      </dl>
    </article>
  );
}
