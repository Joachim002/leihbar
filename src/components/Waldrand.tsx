// Dekorative Silhouette aus Tannen, die sich über die ganze Breite wiederholt.

/** Umriss einer Tanne mit drei Astebenen und Stamm; Mitte `x`, Höhe `h`, steht auf der Unterkante (y = 56). */
function tanne(x: number, h: number) {
  const w = h * 0.55;
  const oben = 56 - h;
  const punkte = [
    [0, 0], [-0.3, 0.3], [-0.15, 0.3], [-0.42, 0.6], [-0.22, 0.6], [-0.5, 0.88],
    [-0.06, 0.88], [-0.06, 1], [0.06, 1], [0.06, 0.88], [0.5, 0.88], [0.22, 0.6],
    [0.42, 0.6], [0.15, 0.3], [0.3, 0.3],
  ];
  return punkte.map(([dx, dy]) => `${(x + dx * w).toFixed(1)},${(oben + dy * h).toFixed(1)}`).join(" ");
}

// Ein Stück Wald, 160 px breit: hintere Reihe hell, vordere dunkel.
const hinten = [tanne(20, 40), tanne(70, 50), tanne(125, 36)];
const vorne = [tanne(45, 30), tanne(100, 44), tanne(150, 26)];

type Props = {
  /** Eindeutig pro Seite (für das Muster). */
  kennung: string;
  className?: string;
};

export default function Waldrand({ kennung, className }: Props) {
  return (
    <svg aria-hidden="true" focusable="false" width="100%" height="56" className={className}>
      <defs>
        <pattern id={kennung} width="160" height="56" patternUnits="userSpaceOnUse">
          {hinten.map((punkte) => (
            <polygon key={punkte} points={punkte} className="fill-accent opacity-60" />
          ))}
          {vorne.map((punkte) => (
            <polygon key={punkte} points={punkte} className="fill-foreground" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="56" fill={`url(#${kennung})`} />
    </svg>
  );
}
