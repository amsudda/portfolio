import { expect, test } from "@playwright/test";
import { PNG_1PX, signIn } from "./helpers";

test.describe("admin", () => {
  test("rejects a wrong password", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("e2e@idearigs.lk");
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toContainText("don't match");
  });

  test("publishing an ad record updates the home page figures", async ({ page }) => {
    await signIn(page, "/admin/meta-ads");
    await expect(page.getByText("4.65x").first()).toBeVisible();

    // Metro Homeware is internal in the seed; publishing needs a 100% split.
    await page.getByRole("button", { name: "Edit Metro Homeware" }).click();
    const drawer = page.getByRole("dialog");
    await drawer.getByRole("radio", { name: "Published" }).click();
    await drawer.getByRole("textbox", { name: "Awareness" }).fill("5");
    await drawer.getByText("SPLIT TOTAL: 95%").waitFor();
    await drawer.getByRole("button", { name: "Save record" }).click();
    await expect(drawer.getByRole("alert")).toContainText("must total 100%");

    await drawer.getByRole("textbox", { name: "Awareness" }).fill("10");
    await drawer.getByRole("button", { name: "Save record" }).click();
    await expect(drawer).toBeHidden();
    // (6.1·4.18 + 3.8·11.64 + 5.4·2.97 + 4.9·6.31 + 4.2·3.45) / 28.55
    await expect(page.getByText("4.59x").first()).toBeVisible();

    await page.goto("/");
    await page.locator("#ads").scrollIntoViewIfNeeded();
    await expect(page.locator("#ads").getByText("4.59x")).toBeVisible();
    await expect(page.locator("#ads").getByRole("table")).toContainText("Metro Homeware");

    // Restore the seed state for other specs.
    await page.goto("/admin/meta-ads");
    await page.getByRole("button", { name: "Edit Metro Homeware" }).click();
    await page.getByRole("dialog").getByRole("radio", { name: "Internal only" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Save record" }).click();
    await expect(page.getByText("4.65x").first()).toBeVisible();
  });

  test("create, edit and delete a client with a logo upload", async ({ page }) => {
    await signIn(page, "/admin/clients");
    await page.getByRole("button", { name: "Add client" }).click();
    const drawer = page.getByRole("dialog");
    await drawer.getByRole("button", { name: "Save client" }).click();
    await expect(drawer.getByRole("alert")).toContainText("Client name is required");

    await drawer.getByLabel("Client name").fill("Colombo Coffee Roasters");
    await drawer.getByLabel("Client since").fill("2026");
    await drawer.getByRole("radio", { name: "Retainer" }).click();
    await drawer.locator('input[type="file"]').setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: PNG_1PX });
    await expect(drawer.getByRole("button", { name: "Remove file" })).toBeVisible();
    await drawer.getByRole("button", { name: "Save client" }).click();
    await expect(drawer).toBeHidden();

    const row = page.getByRole("row", { name: /Colombo Coffee Roasters/ });
    await expect(row).toContainText("RETAINER");
    await expect(row).toContainText("UPLOADED");

    // The uploaded logo is served from /media with an immutable cache header.
    const src = await row.locator("img").getAttribute("src");
    expect(src).toMatch(/^\/media\/\d{4}\/\d{2}\/.+\.png$/);
    const media = await page.request.get(src!);
    expect(media.status()).toBe(200);
    expect(media.headers()["cache-control"]).toContain("immutable");

    await page.goto("/portfolio");
    await expect(page.locator("#clients")).toContainText("Colombo Coffee Roasters");

    await page.goto("/admin/clients");
    await page.getByRole("button", { name: "Edit Colombo Coffee Roasters" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Confirm delete" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByRole("row", { name: /Colombo Coffee Roasters/ })).toHaveCount(0);
  });

  test("a draft project stays off the public site until published", async ({ page }) => {
    await signIn(page, "/admin/projects");
    await page.getByRole("button", { name: "Add project" }).click();
    const drawer = page.getByRole("dialog");
    await drawer.getByLabel("Project title").fill("Monsoon Campaign");
    await drawer.getByLabel("Client", { exact: true }).selectOption({ label: "Kandy Silk House" });
    await drawer.getByRole("button", { name: "Save project" }).click();
    await expect(drawer).toBeHidden();

    expect((await page.request.get("/work/kandy-silk-house-monsoon-campaign")).status()).toBe(404);

    await page.getByRole("button", { name: "Edit Monsoon Campaign" }).click();
    await drawer.getByRole("radio", { name: "Published" }).click();
    await drawer.getByRole("button", { name: "Save project" }).click();
    await expect(drawer.getByRole("alert")).toContainText("summary");

    await drawer.getByLabel("Summary").fill("Seasonal silk collection launch across Instagram and in-store.");
    await drawer.getByRole("textbox", { name: "Metric 1 label" }).fill("Store visits");
    await drawer.getByRole("textbox", { name: "Metric 1 value" }).fill("+90%");
    await drawer.getByRole("button", { name: "Save project" }).click();
    await expect(drawer).toBeHidden();

    await page.goto("/work/kandy-silk-house-monsoon-campaign");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Monsoon Campaign");
    await expect(page.getByText("+90%")).toBeVisible();
  });

  test("showreel reorder and hero-section toggle", async ({ page }) => {
    await signIn(page, "/admin/showreel");
    const items = page.locator("ol > li");
    await expect(items.first()).toContainText("pour sequence");
    await page.getByRole("button", { name: "Move pour sequence down" }).click();
    await expect(items.nth(1)).toContainText("pour sequence");
    await expect(items.first()).toContainText("hiking season spot");
    // Restore the order (clip #1 is the hero's "best work" player).
    await page.getByRole("button", { name: "Move pour sequence up" }).click();
    await expect(items.first()).toContainText("pour sequence");

    await page.goto("/admin/settings");
    const toggle = page.getByRole("switch", { name: "Trust bar" });
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await page.goto("/");
    await expect(page.getByText("SAME CORE TEAM")).toHaveCount(0);

    await page.goto("/admin/settings");
    await page.getByRole("switch", { name: "Trust bar" }).click();
    await expect(page.getByRole("switch", { name: "Trust bar" })).toHaveAttribute("aria-checked", "true");
  });

  test("uploading the #1 reel clip makes the hero preview autoplay", async ({ page }) => {
    await signIn(page, "/admin/showreel");
    await page.getByRole("button", { name: "Edit" }).first().click();
    const drawer = page.getByRole("dialog");
    await drawer.locator('input[type="file"]').first().setInputFiles("e2e/fixtures/sample.webm");
    await expect(drawer.getByRole("button", { name: "Remove file" }).first()).toBeVisible();
    await drawer.getByRole("button", { name: "Save clip" }).click();
    await expect(drawer).toBeHidden();

    await page.goto("/");
    const preview = page.getByTestId("hero-reel-preview");
    // Playing with no user interaction, and actually advancing.
    await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => !v.paused && v.muted && v.currentTime > 0.2)).toBe(true);

    await page.getByRole("button", { name: "Pause preview" }).click();
    await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    await page.getByRole("button", { name: "Resume preview" }).click();
    await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  });

  test("enquiries inbox shows submissions and marks them read", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name *").fill("Inbox Tester");
    await page.getByLabel("Email *").fill("inbox@example.lk");
    await page.getByLabel("What do you need? *").fill("Checking the enquiries inbox works end to end.");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("heading", { name: "Enquiry received." })).toBeVisible();

    await signIn(page, "/admin/enquiries");
    const row = page.getByRole("row", { name: /Inbox Tester/ });
    await expect(row).toContainText("NEW");
    await row.getByRole("button", { name: "Open" }).click();
    await expect(page.getByRole("dialog")).toContainText("Checking the enquiries inbox works end to end.");
    await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
    await expect(row).toContainText("READ");
  });
});
