import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { holeEmail } from "@/lib/supabase/server";
import AnmeldeFormular from "./AnmeldeFormular";

export const metadata: Metadata = { title: "Anmelden" };

export default async function AnmeldenSeite() {
  // Wer schon angemeldet ist, braucht diese Seite nicht.
  if (await holeEmail()) redirect("/");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <h1 className="mb-3 font-display text-4xl">Anmelden</h1>
      <p className="mb-8 max-w-xl text-muted">
        Melde dich mit deiner E-Mail an oder lege ein neues Konto an. Dann kannst du
        Gegenstände anfragen.
      </p>
      <AnmeldeFormular />
    </main>
  );
}
