import { expect, test } from "@playwright/test";

test.describe("public site", () => {
  test("home renders every section with computed performance figures", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Digital management and full-scale production, under one contract.",
    );
    for (const id of ["partnership", "work", "ads", "reel", "studio", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    // Spend-weighted blend of the four published seed records.
    const ads = page.locator("#ads");
    await ads.scrollIntoViewIfNeeded(); // figures count up once in view
    await expect(ads.getByText("4.65x")).toBeVisible();
    await expect(ads.getByText("LKR 13.19")).toBeVisible();
    await expect(ads.getByText("5.5%")).toBeVisible();
    await expect(ads.getByText("LKR 850")).toBeVisible();
    // Internal-only records never reach the public table.
    await expect(ads.getByRole("table")).not.toContainText("Metro Homeware");

    await expect(page.locator("#work article")).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test("hero player opens the full-screen reel and switches clips", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Play our best work: Ceylon Leaf — pour sequence/ }).click();
    const player = page.getByRole("dialog", { name: "Showreel player" });
    await expect(player).toBeVisible();
    await player.getByRole("button", { name: /Nuwara — hiking season spot/ }).click();
    await expect(player.getByRole("button", { name: /Nuwara — hiking season spot/ })).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(player).toBeHidden();
  });

  test("showreel picks a clip and shows the friendly fallback when the file is missing", async ({ page }) => {
    await page.goto("/#reel");
    const reel = page.locator("#reel");
    await reel.getByRole("button", { name: /hiking season spot 1:12/ }).click();
    await expect(reel.getByRole("button", { name: "Play Nuwara — hiking season spot" })).toBeVisible();
    await expect(reel.getByRole("status")).toContainText("ISN'T AVAILABLE");
  });

  test("portfolio lists clients and links campaigns to case studies", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page.locator("#clients li")).toHaveCount(12);
    await page.getByRole("link", { name: /Ceylon Leaf — Retail Launch/ }).click();
    await expect(page).toHaveURL(/\/work\/ceylon-leaf-retail-launch/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Twelve months of always-on content for a heritage tea exporter.",
    );
    await expect(page.getByRole("heading", { name: "The problem" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What we did" })).toBeVisible();
    await expect(page.getByText("NEXT CASE STUDY")).toBeVisible();
  });

  test("unknown case studies return 404", async ({ page }) => {
    const res = await page.goto("/work/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("This page isn't on the schedule.")).toBeVisible();
  });

  test("contact form validates, then stores the enquiry", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name *").fill("A");
    await page.getByLabel("Email *").fill("not-an-email");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toContainText("Please check the highlighted fields.");
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();

    await page.getByLabel("Name *").fill("Test Person");
    await page.getByLabel("Email *").fill("test@example.lk");
    await page.getByLabel("What do you need? *").fill("A quarter of always-on content for our retail launch.");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("heading", { name: "Enquiry received." })).toBeVisible();

    await page.getByRole("button", { name: "Send another enquiry" }).click();
    await expect(page.getByRole("heading", { name: "Send a brief" })).toBeVisible();
  });

  test("SEO endpoints and admin protection", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain("/work/ceylon-leaf-retail-launch");
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /admin");
    const upload = await request.post("/api/admin/upload?filename=a.png&kind=image", { data: "x" });
    expect(upload.status()).toBe(401);
  });
});
