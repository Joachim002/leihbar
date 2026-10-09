import Waldrand from "@/components/Waldrand";

export default function Footer() {
  return (
    <footer className="mt-16">
      <Waldrand kennung="wald-footer" className="block" />
      <div className="bg-foreground px-4 py-8 text-sm text-background">
        <p className="mx-auto max-w-5xl">Leihbar – gebaut im Kurs „Programmieren mit AI“, NDU 2026.</p>
      </div>
    </footer>
  );
}
