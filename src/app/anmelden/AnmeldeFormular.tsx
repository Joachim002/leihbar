"use client";

import { useActionState } from "react";
import { anmeldenOderRegistrieren, type FormZustand } from "./actions";

const feld =
  "min-h-11 w-full rounded-xl border border-border bg-card px-4 text-base";
const knopf =
  "min-h-11 rounded-xl px-5 font-medium transition disabled:opacity-60";

export default function AnmeldeFormular() {
  const [zustand, aktion, laeuft] = useActionState<FormZustand, FormData>(
    anmeldenOderRegistrieren,
    null,
  );

  return (
    <form action={aktion} className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={zustand?.email}
          className={feld}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="passwort" className="font-medium">
          Passwort
        </label>
        <input
          id="passwort"
          name="passwort"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
          className={feld}
        />
        <p className="text-sm text-muted">Mindestens 6 Zeichen.</p>
      </div>

      {zustand && (
        <p
          role={zustand.erfolg ? "status" : "alert"}
          className={`rounded-xl px-4 py-3 ${
            zustand.erfolg ? "bg-accent-soft" : "border border-accent"
          }`}
        >
          {zustand.meldung}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="aktion"
          value="anmelden"
          disabled={laeuft}
          className={`${knopf} bg-accent text-white shadow-sm hover:opacity-90`}
        >
          Anmelden
        </button>
        <button
          type="submit"
          name="aktion"
          value="registrieren"
          disabled={laeuft}
          className={`${knopf} border border-border bg-card hover:bg-accent-soft`}
        >
          Neu registrieren
        </button>
      </div>
    </form>
  );
}
