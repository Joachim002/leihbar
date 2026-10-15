"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Inbox } from "lucide-react";
import { offeneAnfragenZahl } from "@/app/eingehende-anfragen/actions";

/** Link zu den eingegangenen Anfragen; die Zahl der offenen steht daran und aktualisiert sich von selbst. */
export default function AnfragenHinweis({ anzahl }: { anzahl: number | null }) {
  const [live, setzeLive] = useState(anzahl ?? 0);
  const [serverAnzahl, setzeServerAnzahl] = useState(anzahl);
  if (anzahl !== serverAnzahl) {
    setzeServerAnzahl(anzahl);
    // `null` = die Datenbank hat nicht geantwortet: die zuletzt bekannte Zahl bleibt stehen.
    if (anzahl !== null) setzeLive(anzahl);
  }

  useEffect(() => {
    let aktiv = true;
    async function frage() {
      if (document.hidden) return;
      try {
        const neu = await offeneAnfragenZahl();
        if (aktiv && neu !== null) setzeLive(neu);
      } catch {
        // Kein Netz: die alte Zahl bleibt stehen.
      }
    }
    const takt = setInterval(frage, 3000);
    return () => {
      aktiv = false;
      clearInterval(takt);
    };
  }, []);

  return (
    <Link
      href="/eingehende-anfragen"
      aria-label={live > 0 ? `Eingegangene Anfragen, ${live} offen` : "Eingegangene Anfragen"}
      className="relative flex size-11 items-center justify-center text-foreground hover:bg-accent-soft"
    >
      <Inbox size={22} strokeWidth={1.75} aria-hidden="true" />
      <AnimatePresence initial={false}>
        {live > 0 && (
          <motion.span
            key={live}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            className="absolute right-0.5 top-0.5 flex min-w-5 items-center justify-center bg-accent px-1 text-sm font-medium leading-5 text-accent-ink"
          >
            {live}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
