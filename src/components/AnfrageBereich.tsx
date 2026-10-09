"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { Hand } from "lucide-react";
import { anfrageUmschalten } from "@/app/gegenstaende/[id]/actions";

type Props = {
  itemId: string;
  anzahl: number;
  angefragt: boolean;
  angemeldet: boolean;
  eigener: boolean;
  verfuegbar: boolean;
};

const knopf =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-6 font-medium shadow-sm transition sm:w-auto";

export default function AnfrageBereich({ itemId, anzahl, angefragt, angemeldet, eigener, verfuegbar }: Props) {
  const [laeuft, starte] = useTransition();
  const [meldung, setzeMeldung] = useState<string | null>(null);
  // Sofort umschalten; kommt vom Server etwas anderes zurück, springt es wieder zurück.
  const [stand, setzeStand] = useOptimistic(
    { anzahl, angefragt },
    (_alt, neu: { anzahl: number; angefragt: boolean }) => neu,
  );

  function klick() {
    const anfragen = !stand.angefragt;
    setzeMeldung(null);
    starte(async () => {
      setzeStand({ anzahl: stand.anzahl + (anfragen ? 1 : -1), angefragt: anfragen });
      const ergebnis = await anfrageUmschalten(itemId, anfragen);
      if (!ergebnis.ok) setzeMeldung(ergebnis.meldung ?? null);
    });
  }

  let aktion;
  if (eigener) {
    aktion = <p className="rounded-xl bg-accent-soft px-4 py-3">Das ist dein Gegenstand. Hier siehst du bald, wer ihn anfragt.</p>;
  } else if (!angemeldet) {
    aktion = (
      <Link href="/anmelden" className={`${knopf} bg-accent text-white hover:opacity-90`}>
        <Hand size={20} strokeWidth={1.75} aria-hidden="true" />
        Ausleihen anfragen
      </Link>
    );
  } else if (!verfuegbar && !stand.angefragt) {
    aktion = <p className="rounded-xl bg-accent-soft px-4 py-3">Anfragen geht erst wieder, wenn der Gegenstand zurück ist.</p>;
  } else {
    aktion = (
      <button
        type="button"
        onClick={klick}
        disabled={laeuft}
        aria-pressed={stand.angefragt}
        className={`${knopf} disabled:opacity-70 ${
          stand.angefragt
            ? "border border-border bg-accent-soft hover:opacity-90"
            : "bg-accent text-white hover:opacity-90"
        }`}
      >
        {!stand.angefragt && <Hand size={20} strokeWidth={1.75} aria-hidden="true" />}
        {stand.angefragt ? "Angefragt ✓" : "Ausleihen anfragen"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted">
        <span>Anfragen: </span>
        <span className="font-medium text-foreground" aria-live="polite">{stand.anzahl}</span>
      </p>
      {aktion}
      {meldung && (
        <p role="alert" className="text-sm text-error">
          {meldung}
        </p>
      )}
      {angemeldet && stand.angefragt && (
        <p className="text-sm text-muted">Klick noch einmal, um die Anfrage zurückzuziehen.</p>
      )}
    </div>
  );
}
