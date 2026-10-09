"use client";

import { useActionState } from "react";
import { kategorien } from "@/data/gegenstaende";
import { gegenstandAnbieten, type AnbietenZustand, type Feld } from "./actions";

const feld = "min-h-11 w-full rounded-xl border bg-card px-4 text-base";

export default function AnbietenFormular() {
  const [zustand, aktion, laeuft] = useActionState<AnbietenZustand, FormData>(
    gegenstandAnbieten,
    null,
  );
  const eingaben = zustand?.eingaben;

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
    <form action={aktion} noValidate className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="titel" className="font-medium">
          Titel
        </label>
        <input
          {...eigenschaften("titel")}
          type="text"
          maxLength={100}
          defaultValue={eingaben?.titel}
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
          rows={4}
          maxLength={1000}
          defaultValue={eingaben?.beschreibung}
          className={`${eigenschaften("beschreibung").className} py-3`}
        />
        {fehlerText("beschreibung")}
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
        <p role="alert" className="rounded-xl border border-error px-4 py-3 font-medium text-error">
          {zustand.meldung}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={laeuft}
          className="min-h-11 rounded-xl bg-accent px-6 font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {laeuft ? "Wird gespeichert …" : "Anbieten"}
        </button>
      </div>
    </form>
  );
}
