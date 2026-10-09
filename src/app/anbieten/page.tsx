import type { Metadata } from "next";
import AnbietenFormular from "./AnbietenFormular";

export const metadata: Metadata = { title: "Gegenstand anbieten" };

export default function AnbietenSeite() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <h1 className="mb-3 font-display text-4xl font-extrabold tracking-tight">
        Gegenstand anbieten
      </h1>
      <p className="mb-8 max-w-xl text-muted">
        Trag ein, was du verleihen möchtest. Danach erscheint es sofort in der Liste.
      </p>
      <AnbietenFormular />
    </main>
  );
}
