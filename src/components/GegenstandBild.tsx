import Image from "next/image";
import { Package } from "lucide-react";

type Props = {
  /** Bildpfad oder `null` für den neutralen Platzhalter. */
  bild: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Füllt den umgebenden Kasten (muss `relative` sein und ein festes Seitenverhältnis haben). */
export default function GegenstandBild({ bild, alt, sizes, className, priority }: Props) {
  if (!bild) {
    return (
      <div
        className="flex h-full w-full items-center justify-center text-muted"
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
      >
        <Package size={48} strokeWidth={1.5} aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={bild}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover ${className ?? ""}`}
      preload={priority}
    />
  );
}
