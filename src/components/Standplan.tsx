import type { Gegenstand } from "@/data/gegenstaende";
import GegenstandKarte from "@/components/GegenstandKarte";
import type { AnfrageStatus } from "@/lib/anfragen";

type Eintrag = { gegenstand: Gegenstand; status?: AnfrageStatus };

type Props = {
  eintraege: Eintrag[];
  ueberschrift: "h2" | "h3";
};

// Wie viele Felder ein Stand belegt: groß, klein, klein, hoch, klein, breit – dann wieder von vorn.
const groessen = [
  "col-span-2 row-span-2",
  "",
  "",
  "row-span-2",
  "",
  "col-span-2",
];

/** Der Plan: Fotos Kante an Kante, getrennt nur durch Linien in Lackweiß. */
export default function Standplan({ eintraege, ueberschrift }: Props) {
  return (
    <ul className="grid auto-rows-[11rem] grid-cols-2 gap-0.5 border-2 border-foreground bg-foreground [grid-auto-flow:dense] sm:auto-rows-[14rem] sm:grid-cols-4">
      {eintraege.map(({ gegenstand, status }, index) => (
        <li key={gegenstand.id} className={groessen[index % groessen.length]}>
          <GegenstandKarte
            gegenstand={gegenstand}
            nummer={index + 1}
            ueberschrift={ueberschrift}
            status={status}
          />
        </li>
      ))}
    </ul>
  );
}
