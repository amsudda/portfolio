import type { Metadata } from "next";
import { revalidateSite } from "@/lib/admin/action";
import { requireUser } from "@/lib/auth/session";
import { getSettings, saveSettings } from "@/lib/settings";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Site settings" };

async function updateToggle(key: "showTrustBar" | "showAdsBreakdown" | "showClosingCta", value: boolean) {
  "use server";
  await requireUser();
  if (!["showTrustBar", "showAdsBreakdown", "showClosingCta"].includes(key) || typeof value !== "boolean") return;
  await saveSettings({ [key]: value });
  revalidateSite();
}

export default async function SettingsPage() {
  const settings = await getSettings();
  return <SettingsForm settings={settings} update={updateToggle} />;
}
