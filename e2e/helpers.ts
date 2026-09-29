import { expect, type Page } from "@playwright/test";
import { E2E_ADMIN } from "../playwright.config";

export async function signIn(page: Page, next = "/admin/projects") {
  await page.goto(next);
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel("Email").fill(E2E_ADMIN.email);
  await page.getByLabel("Password").fill(E2E_ADMIN.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(new RegExp(next.replace(/\//g, "\\/")));
}

/** A valid 1×1 PNG, for exercising uploads. */
export const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);
