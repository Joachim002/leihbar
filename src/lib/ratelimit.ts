// Einfache Begrenzung im Arbeitsspeicher des Servers: höchstens `max` Aufrufe pro Person und Zeitfenster.
// Auf Vercel gilt sie pro Server-Instanz, das reicht hier als Schutz vor Dauerklicken.
const aufrufe = new Map<string, number[]>();

export function darfAufrufen(schluessel: string, max = 5, fensterMs = 60_000): boolean {
  const jetzt = Date.now();
  const frisch = (aufrufe.get(schluessel) ?? []).filter((zeit) => jetzt - zeit < fensterMs);
  if (frisch.length >= max) {
    aufrufe.set(schluessel, frisch);
    return false;
  }
  frisch.push(jetzt);
  aufrufe.set(schluessel, frisch);
  return true;
}
