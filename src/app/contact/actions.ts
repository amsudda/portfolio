"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { enquiryBudgets, enquiryServices } from "@/content/site";
import { db, schema } from "@/lib/db";
import { notifyNewEnquiry } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  company: z.string().trim().max(160).default(""),
  email: z.email("Please enter a valid email address.").trim().max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+()\d\s-]*$/, "Phone numbers can only contain digits, spaces, + and -.")
    .default(""),
  service: z.enum(enquiryServices).catch(enquiryServices[0]),
  budget: z.enum(enquiryBudgets).catch(enquiryBudgets[4]),
  message: z.string().trim().min(10, "Tell us a little more — at least a sentence.").max(5000),
});

export type EnquiryField = keyof z.infer<typeof enquirySchema>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<EnquiryField, string>>; values?: Record<string, string> };

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const values = Object.fromEntries(
    ["name", "company", "email", "phone", "service", "budget", "message"].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  const limit = rateLimit(`enquiry:${await clientIp()}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Too many enquiries from this connection. Please try again in ${Math.ceil(limit.retryAfterSec / 60)} minutes, or email us directly.`,
      values,
    };
  }

  const parsed = enquirySchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<EnquiryField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as EnquiryField;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors, values };
  }

  try {
    const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? "";
    const [row] = await db
      .insert(schema.enquiries)
      .values({ ...parsed.data, userAgent })
      .returning();
    await notifyNewEnquiry(row);
  } catch (err) {
    console.error("[enquiry] failed to store", err);
    return {
      status: "error",
      message: "Something went wrong on our side. Please try again, or email hello@idearigs.lk.",
      values,
    };
  }

  return { status: "success" };
}
