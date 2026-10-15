"use client";

import Link from "next/link";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { Hand } from "lucide-react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { anfrageUmschalten } from "@/app/gegenstaende/[id]/actions";
import { browserClient } from "@/lib/supabase/browser";

type Props = {
  itemId: string;
  anzahl: number;
  angefragt: boolean;
  angemeldet: boolean;
  eigener: boolean;
  verfuegbar: boolean;
};

const knopf =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 px-6 font-medium transition sm:w-auto";

export default function AnfrageBereich({ itemId, anzahl, angefragt, angemeldet, eigener, verfuegbar }: Props) {
  const [laeuft, starte] = useTransition();
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const [knopfRef, animiere] = useAnimate<HTMLButtonElement>();
  const weniger = useReducedMotion();
  // Der Zähler wird alle paar Sekunden neu gefragt, damit Anfragen anderer ohne Neuladen auftauchen.
  const [liveAnzahl, setzeLiveAnzahl] = useState(anzahl);
  const [serverAnzahl, setzeServerAnzahl] = useState(anzahl);
  if (anzahl !== serverAnzahl) {
    setzeServerAnzahl(anzahl);
    setzeLiveAnzahl(anzahl);
  }
  // Sofort umschalten; kommt vom Server etwas anderes zurück, springt es wieder zurück.
  const [stand, setzeStand] = useOptimistic(
    { anzahl: liveAnzahl, angefragt },
    (_alt, neu: { anzahl: number; angefragt: boolean }) => neu,
  );

  useEffect(() => {
    if (!browserClient || laeuft) return;
    let aktiv = true;
    async function frage() {
      if (document.hidden) return;
      const { data, error } = await browserClient!.rpc("anfrage_anzahl", { p_item_id: itemId });
      if (aktiv && !error && typeof data === "number") setzeLiveAnzahl(data);
    }
    const takt = setInterval(frage, 2000);
    return () => {
      aktiv = false;
      clearInterval(takt);
    };
  }, [itemId, laeuft]);

  function klick() {
    const anfragen = !stand.angefragt;
    setzeMeldung(null);
    starte(async () => {
      setzeStand({ anzahl: stand.anzahl + (anfragen ? 1 : -1), angefragt: anfragen });
      const ergebnis = await anfrageUmschalten(itemId, anfragen);
      if (!ergebnis.ok) {
        setzeMeldung(ergebnis.meldung ?? null);
        // Kurzes Wackeln, damit man den Fehler auch sieht; bei „Bewegung reduzieren“ nur die Meldung.
        if (!weniger && knopfRef.current) animiere(knopfRef.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.3 });
      }
    });
  }

  let aktion;
  if (eigener) {
    aktion = <p className="bg-accent-soft px-4 py-3">Das ist dein Gegenstand. Wer ihn angefragt hat, siehst du weiter unten.</p>;
  } else if (!angemeldet) {
    aktion = (
      <Link href="/anmelden" className={`${knopf} bg-accent text-accent-ink hover:opacity-90`}>
        <Hand size={20} strokeWidth={1.75} aria-hidden="true" />
        Ausleihen anfragen
      </Link>
    );
  } else if (!verfuegbar && !stand.angefragt) {
    aktion = <p className="bg-accent-soft px-4 py-3">Anfragen geht erst wieder, wenn der Gegenstand zurück ist.</p>;
  } else {
    aktion = (
      <button
        ref={knopfRef}
        type="button"
        onClick={klick}
        disabled={laeuft}
        aria-pressed={stand.angefragt}
        className={`${knopf} disabled:opacity-70 ${
          stand.angefragt
            ? "border border-border bg-accent-soft hover:opacity-90"
            : "bg-accent text-accent-ink hover:opacity-90"
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
        <span className="relative inline-flex overflow-hidden align-bottom font-medium text-foreground" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={stand.anzahl}
              initial={weniger ? false : { y: "60%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={weniger ? { opacity: 0, transition: { duration: 0 } } : { y: "-60%", opacity: 0 }}
              transition={{ duration: weniger ? 0 : 0.2, ease: "easeOut" }}
              className="inline-block"
            >
              {stand.anzahl}
            </motion.span>
          </AnimatePresence>
        </span>
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
