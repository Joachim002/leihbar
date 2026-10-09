import type { Gegenstand } from "@/data/gegenstaende";
import GegenstandKarte from "@/components/GegenstandKarte";
import type { AnfrageStatus } from "@/lib/anfragen";

type Eintrag = { gegenstand: Gegenstand; status?: AnfrageStatus };

type Props = {
  eintraege: Eintrag[];
  ueberschrift: "h2" | "h3";
};

/** Der Katalog: jedes Los mit großem Foto und viel Rand; am Handy eins pro Zeile. */
export default function Katalog({ eintraege, ueberschrift }: Props) {
  return (
    <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
      {eintraege.map(({ gegenstand, status }, index) => (
        <li key={gegenstand.id}>
          <GegenstandKarte
            gegenstand={gegenstand}
            nummer={index + 1}
            ueberschrift={ueberschrift}
            status={status}
            priority={index === 0}
          />
        </li>
      ))}
    </ul>
  );
}
