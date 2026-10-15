"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import GegenstandKarte from "@/components/GegenstandKarte";
import { kategorien, type Gegenstand, type Kategorie } from "@/data/gegenstaende";

type Props = {
  /** Alle ausleihbaren Gegenstände; `null`, wenn sie nicht geladen werden konnten. */
  gegenstaende: Gegenstand[] | null;
  /** Kategorie aus der Adresse, `null` heißt „Alle“. */
  aktiv: Kategorie | null;
};

const basis = "relative inline-flex min-h-11 items-center transition-colors";

function href(kategorie: Kategorie | null) {
  if (!kategorie) return "/";
  return `/?${new URLSearchParams({ kategorie })}`;
}

/** Filter und Katalog: Der Filter wirkt sofort, die Karten gleiten an ihren neuen Platz. */
export default function FilterKatalog({ gegenstaende, aktiv }: Props) {
  const router = useRouter();
  const [, starte] = useTransition();
  // Sofort die gewählte Kategorie zeigen; die Adresse zieht gleich nach und ist am Ende die Wahrheit.
  const [gewaehlt, setzeGewaehlt] = useOptimistic(aktiv);
  const ohneBewegung = useReducedMotion();

  const sichtbar = (gegenstaende ?? []).filter((g) => !gewaehlt || g.kategorie === gewaehlt);

  function waehle(event: MouseEvent<HTMLAnchorElement>, kategorie: Kategorie | null) {
    // Strg-/Cmd-Klick und Mittelklick öffnen wie gewohnt einen neuen Tab.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    starte(() => {
      setzeGewaehlt(kategorie);
      router.push(href(kategorie), { scroll: false });
    });
  }

  const dauer = ohneBewegung ? 0 : 0.2;

  return (
    <>
      <nav aria-label="Nach Kategorie filtern" className="mb-10">
        <ul className="flex flex-wrap gap-x-6">
          {[null, ...kategorien].map((kategorie) => {
            const istAktiv = gewaehlt === kategorie;
            return (
              <li key={kategorie ?? "alle"}>
                <Link
                  href={href(kategorie)}
                  onClick={(event) => waehle(event, kategorie)}
                  aria-current={istAktiv ? "true" : undefined}
                  className={`${basis} ${istAktiv ? "text-foreground" : "text-muted hover:text-foreground"}`}
                >
                  {kategorie ?? "Alle"}
                  {istAktiv && (
                    <motion.span
                      layoutId="filter-markierung"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <p className="sr-only" aria-live="polite">
        {sichtbar.length === 1 ? "1 Gegenstand" : `${sichtbar.length} Gegenstände`}
      </p>

      {sichtbar.length > 0 ? (
        <ul className="relative grid gap-x-10 gap-y-14 sm:grid-cols-2">
          <AnimatePresence initial={false} mode="popLayout">
            {sichtbar.map((gegenstand, index) => (
              <motion.li
                key={gegenstand.id}
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: dauer, layout: { duration: ohneBewegung ? 0 : 0.35, ease: "easeOut" } }}
              >
                <GegenstandKarte gegenstand={gegenstand} nummer={index + 1} ueberschrift="h3" priority={index === 0} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <p className="border-y border-foreground py-10 text-center text-muted">
          {gegenstaende === null
            ? "Die Gegenstände lassen sich gerade nicht laden. Bitte versuch es gleich noch einmal."
            : gewaehlt
              ? `In der Kategorie „${gewaehlt}“ ist gerade nichts zum Ausleihen da. Wähle oben „Alle“, um alles zu sehen.`
              : "Gerade ist nichts zum Ausleihen da. Biete doch selbst etwas an."}
        </p>
      )}
    </>
  );
}
