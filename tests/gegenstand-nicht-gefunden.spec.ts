import { test, expect } from "@playwright/test";

test("unbekannter Gegenstand zeigt eine verständliche Meldung", async ({ page }) => {
  await page.goto("/gegenstaende/gibt-es-nicht");

  await expect(
    page.getByRole("heading", { level: 1, name: "Diesen Gegenstand gibt es nicht" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Zurück zur Liste" })).toBeVisible();
});
