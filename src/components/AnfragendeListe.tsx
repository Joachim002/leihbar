import type { Anfragende } from "@/lib/anfragen";

type Props = {
  /** `null`, wenn die Liste nicht geladen werden konnte. */
  anfragende: Anfragende[] | null;
};

export default function AnfragendeListe({ anfragende }: Props) {
  return (
    <section aria-labelledby="anfragende-titel" className="mt-10 rounded-3xl border border-border bg-card p-5 sm:p-6">
      <h2 id="anfragende-titel" className="mb-3 font-display text-2xl font-bold">
        Angefragt von:
      </h2>
      {anfragende === null ? (
        <p className="text-muted">Die Anfragen lassen sich gerade nicht laden. Bitte versuch es gleich noch einmal.</p>
      ) : anfragende.length === 0 ? (
        <p className="text-muted">Noch hat niemand diesen Gegenstand angefragt.</p>
      ) : (
        <ul className="divide-y divide-border">
          {anfragende.map((person) => (
            <li key={person.email} className="py-3">
              <a href={`mailto:${person.email}`} className="break-all font-medium underline-offset-4 hover:underline">
                {person.email}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
