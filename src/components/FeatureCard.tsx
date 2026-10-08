import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  titel: string;
  text: string;
};

export default function FeatureCard({ icon: Icon, titel, text }: Props) {
  return (
    <div className="rounded-3xl bg-card p-7 text-center shadow-sm sm:text-left">
      {/* Lucide-Icons sind ohne aria-label automatisch aria-hidden – rein dekorativ. */}
      <Icon className="mx-auto mb-4 text-accent sm:mx-0" size={28} strokeWidth={1.75} />
      <h2 className="mb-1 font-display text-lg font-bold">{titel}</h2>
      <p className="leading-relaxed text-muted">{text}</p>
    </div>
  );
}
