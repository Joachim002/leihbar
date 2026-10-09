import Link from "next/link";
import type { Gegenstand } from "@/data/gegenstaende";
import GegenstandBild from "@/components/GegenstandBild";
import type { AnfrageStatus } from "@/lib/anfragen";
import { preisText } from "@/lib/format";

type Props = {
  gegenstand: Gegenstand;
  /** Losnummer im Katalog. */
  nummer: number;
  /** Ebene der Überschrift: unter einem h2 (Startseite) h3, direkt unter dem h1 h2. */
  ueberschrift?: "h2" | "h3";
  /** Antwort auf die Anfrage der angemeldeten Person (nur auf „Meine Anfragen“). */
  status?: AnfrageStatus;
  /** Das erste sichtbare Foto der Seite lädt sofort. */
  priority?: boolean;
};

/** Ein Los: großes Foto, darunter Losnummer und Preis, dann Titel und Herkunft. */
export default function GegenstandKarte({
  gegenstand,
  nummer,
  ueberschrift: Ueberschrift = "h3",
  status,
  priority,
}: Props) {
  const { id, titel, kategorie, besitzer, ort, preisProTag, bild } = gegenstand;

  return (
    <article className="group relative flex flex-col">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-accent-soft">
        {/* Der Titel steht direkt darunter, deshalb ist der Alt-Text leer. */}
        <GegenstandBild
          bild={bild}
          alt=""
          sizes="(min-width: 1024px) 460px, (min-width: 640px) 45vw, 100vw"
          className="transition duration-700 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>
      <div className="flex items-baseline justify-between gap-4 border-t border-foreground pt-2">
        <p className="font-display text-lg text-accent">Los {nummer}</p>
        <p className="text-base">{preisText(preisProTag)}</p>
      </div>
      <Ueberschrift className="mt-1 font-display text-3xl leading-tight hyphens-auto">
        {/* Der unsichtbare Bereich (after) macht das ganze Los anklickbar. */}
        <Link href={`/gegenstaende/${id}`} className="after:absolute after:inset-0 after:content-['']">
          {titel}
        </Link>
      </Ueberschrift>
      <dl className="mt-2 text-sm text-muted">
        <dt className="sr-only">Kategorie:</dt>
        <dd className="sr-only">{kategorie}</dd>
        <div className="flex gap-1">
          <dt>Ort:</dt>
          <dd>{ort}</dd>
        </div>
        <div className="flex gap-1">
          <dt>Verleiht:</dt>
          <dd>{besitzer}</dd>
        </div>
        {status && (
          <div className="flex gap-1 text-foreground">
            <dt>Status:</dt>
            <dd className="font-semibold">{status}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
