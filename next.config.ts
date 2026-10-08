import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Das „N“-Symbol unten links im Entwicklungsmodus ausblenden – es verdeckt am Handy Inhalte.
  devIndicators: false,
  // Im GitHub Codespace läuft die Vorschau über eine Weiterleitung (…app.github.dev).
  // Ohne diese Freigabe lehnt Next.js Formulare wie die Anmeldung als „Invalid Server Actions request“ ab.
  // Gilt nur im Codespace, nicht auf Vercel.
  ...(process.env.CODESPACES
    ? { experimental: { serverActions: { allowedOrigins: ["*.app.github.dev"] } } }
    : {}),
};

export default nextConfig;
