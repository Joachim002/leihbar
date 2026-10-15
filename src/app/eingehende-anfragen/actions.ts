"use server";

import { holeOffeneAnfragenZahl } from "@/lib/anfragen";

/** Für den Hinweis im Header, der die Zahl alle paar Sekunden neu fragt. */
export async function offeneAnfragenZahl(): Promise<number | null> {
  return holeOffeneAnfragenZahl();
}
