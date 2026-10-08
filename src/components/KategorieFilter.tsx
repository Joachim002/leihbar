import Link from "next/link";
import { kategorien, type Kategorie } from "@/data/gegenstaende";

type Props = {
  /** Aktive Kategorie, `null` heißt „Alle“. */
  aktiv: Kategorie | null;
};

const basis =
  "inline-flex min-h-11 items-center rounded-full border px-4 font-medium transition";
const aktivKlasse = "border-accent bg-accent text-white";
const inaktivKlasse = "border-border bg-card hover:bg-accent-soft";

function href(kategorie: Kategorie | null) {
  if (!kategorie) return "/#gegenstaende";
  return `/?${new URLSearchParams({ kategorie })}#gegenstaende`;
}

export default function KategorieFilter({ aktiv }: Props) {
  return (
    <nav aria-label="Nach Kategorie filtern" className="mb-6">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={href(null)}
            aria-current={aktiv === null ? "true" : undefined}
            className={`${basis} ${aktiv === null ? aktivKlasse : inaktivKlasse}`}
          >
            Alle
          </Link>
        </li>
        {kategorien.map((kategorie) => (
          <li key={kategorie}>
            <Link
              href={href(kategorie)}
              aria-current={aktiv === kategorie ? "true" : undefined}
              className={`${basis} ${aktiv === kategorie ? aktivKlasse : inaktivKlasse}`}
            >
              {kategorie}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
