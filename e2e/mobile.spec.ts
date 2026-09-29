import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("mobile (390px)", () => {
  test("no horizontal scroll on public pages", async ({ page }) => {
    for (const path of ["/", "/portfolio", "/work/ceylon-leaf-retail-launch", "/contact"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
    }
  });

  test("full-screen menu opens, marks the current page and closes on navigation", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Site navigation" });
    await expect(menu.getByRole("navigation", { name: "Mobile" }).getByRole("link")).toHaveCount(7);
    await expect(menu.getByRole("link", { name: /Portfolio/ })).toHaveAttribute("aria-current", "page");
    await menu.getByRole("link", { name: /^Contact/ }).click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(menu).toBeHidden();
  });

  test("hero headline and CTA are visible without scrolling", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await expect(page.locator("#top").getByRole("link", { name: /Book a strategy call/ })).toBeInViewport();
  });

  test("admin uses a drawer menu and tappable cards", async ({ page }) => {
    await signIn(page, "/admin/clients");
    await expect(page.getByRole("table")).toBeHidden();
    await page.getByRole("button", { name: "Edit Ceylon Leaf Tea Co." }).last().click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    const width = await drawer.evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBe(390);
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog", { name: "Admin navigation" }).getByRole("link", { name: "Meta ads data" }).click();
    await expect(page).toHaveURL(/\/admin\/meta-ads/);
  });
});
