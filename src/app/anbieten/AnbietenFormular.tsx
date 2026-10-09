"use client";

import { useActionState, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { kategorien } from "@/data/gegenstaende";
import { gegenstandAnbieten, type AnbietenZustand, type Feld } from "./actions";

const feld = "min-h-11 w-full border bg-card px-4 text-base";

export default function AnbietenFormular() {
  const [zustand, aktion, laeuft] = useActionState<AnbietenZustand, FormData>(
    gegenstandAnbieten,
    null,
  );
  const eingaben = zustand?.eingaben;
  const formular = useRef<HTMLFormElement>(null);
  const beschreibungFeld = useRef<HTMLTextAreaElement>(null);
  const [titelText, setzeTitelText] = useState(eingaben?.titel ?? "");
  const [vorschlagLaeuft, setzeVorschlagLaeuft] = useState(false);
  const [vorschlagMeldung, setzeVorschlagMeldung] = useState<string | null>(null);

  async function beschreibungVorschlagen() {
    if (!formular.current) return;
    const daten = new FormData(formular.current);
    setzeVorschlagLaeuft(true);
    setzeVorschlagMeldung(null);
    try {
      const antwort = await fetch("/api/beschreibung", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          titel: daten.get("titel"),
          kategorie: daten.get("kategorie"),
          ort: daten.get("ort"),
        }),
      });
      const ergebnis = await antwort.json().catch(() => null);
      if (antwort.ok && ergebnis?.beschreibung && beschreibungFeld.current) {
        beschreibungFeld.current.value = ergebnis.beschreibung;
      } else {
        setzeVorschlagMeldung(ergebnis?.meldung ?? "Der Vorschlag hat gerade nicht geklappt. Versuch es gleich noch einmal.");
      }
    } catch {
      setzeVorschlagMeldung("Der Vorschlag hat gerade nicht geklappt. Versuch es gleich noch einmal.");
    } finally {
      setzeVorschlagLaeuft(false);
    }
  }

  /** Rahmen und Vorlese-Hinweise eines Feldes; bei Fehler roter Rahmen und die Meldung darunter. */
  const eigenschaften = (name: Feld, hinweisId?: string) => {
    const fehler = zustand?.fehler[name];
    return {
      id: name,
      name,
      "aria-invalid": fehler ? true : undefined,
      "aria-describedby": [fehler ? `${name}-fehler` : null, hinweisId].filter(Boolean).join(" ") || undefined,
      className: `${feld} ${fehler ? "border-error" : "border-border"}`,
    };
  };

  const fehlerText = (name: Feld) =>
    zustand?.fehler[name] ? (
      <p id={`${name}-fehler`} className="text-sm font-medium text-error">
        {zustand.fehler[name]}
      </p>
    ) : null;

  return (
    // noValidate: Die Prüfung läuft auf dem Server und erklärt Fehler in ganzen Sätzen.
    <form ref={formular} action={aktion} noValidate className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="titel" className="font-medium">
          Titel
        </label>
        <input
          {...eigenschaften("titel")}
          type="text"
          maxLength={100}
          defaultValue={eingaben?.titel}
          onChange={(ereignis) => setzeTitelText(ereignis.target.value)}
        />
        {fehlerText("titel")}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="kategorie" className="font-medium">
          Kategorie
        </label>
        <select
          // key: Nach einem Fehler setzt das Formular die Auswahl zurück; so bleibt sie erhalten.
          key={eingaben?.kategorie}
          {...eigenschaften("kategorie")}
          defaultValue={eingaben?.kategorie ?? ""}
        >
          <option value="" disabled>
            Bitte wählen
          </option>
          {kategorien.map((kategorie) => (
            <option key={kategorie} value={kategorie}>
              {kategorie}
            </option>
          ))}
        </select>
        {fehlerText("kategorie")}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="beschreibung" className="font-medium">
          Beschreibung
        </label>
        <textarea
          {...eigenschaften("beschreibung")}
          ref={beschreibungFeld}
          rows={4}
          maxLength={1000}
          defaultValue={eingaben?.beschreibung}
          className={`${eigenschaften("beschreibung").className} py-3`}
        />
        {fehlerText("beschreibung")}
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={beschreibungVorschlagen}
            disabled={!titelText.trim() || vorschlagLaeuft}
            className="inline-flex min-h-11 items-center gap-2 border border-border bg-card px-4 font-medium transition hover:bg-accent-soft disabled:opacity-60"
          >
            <Sparkles size={20} strokeWidth={1.75} aria-hidden="true" />
            {vorschlagLaeuft ? "Vorschlag wird geschrieben …" : "Beschreibung vorschlagen"}
          </button>
          {vorschlagMeldung && (
            <p role="alert" className="text-sm font-medium text-error">
              {vorschlagMeldung}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="ort" className="font-medium">
          Ort der Abholung
        </label>
        <input
          {...eigenschaften("ort")}
          type="text"
          maxLength={100}
          defaultValue={eingaben?.ort}
        />
        {fehlerText("ort")}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="preis" className="font-medium">
          Preis pro Tag in Euro
        </label>
        <input
          {...eigenschaften("preis", "preis-hinweis")}
          type="text"
          inputMode="decimal"
          defaultValue={eingaben?.preis ?? "0"}
        />
        {fehlerText("preis")}
        <p id="preis-hinweis" className="text-sm text-muted">
          0 heißt gratis.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="besitzer" className="font-medium">
          Dein Name
        </label>
        <input
          {...eigenschaften("besitzer")}
          type="text"
          autoComplete="given-name"
          maxLength={60}
          defaultValue={eingaben?.besitzer}
        />
        {fehlerText("besitzer")}
      </div>

      {zustand?.meldung && (
        <p role="alert" className="border border-error px-4 py-3 font-medium text-error">
          {zustand.meldung}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={laeuft}
          className="min-h-11 bg-accent px-6 font-medium text-accent-ink transition hover:opacity-90 disabled:opacity-60"
        >
          {laeuft ? "Wird gespeichert …" : "Anbieten"}
        </button>
      </div>
    </form>
  );
}
