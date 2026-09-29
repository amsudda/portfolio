"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { company, enquiryBudgets, enquiryServices } from "@/content/site";
import { cn } from "@/lib/cn";
import { submitEnquiry, type EnquiryField, type EnquiryState } from "./actions";

const labelCls = "font-mono text-[10.5px] tracking-[0.1em] text-muted";
const fieldCls =
  "w-full border border-field bg-paper px-3.5 py-[13px] text-[15px] text-ink outline-none transition-colors focus:border-green aria-[invalid=true]:border-[#B42318]";

export function EnquiryForm() {
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { status: "idle" });
  const [dismissed, setDismissed] = useState<EnquiryState | null>(null);
  const [formKey, setFormKey] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const sent = state.status === "success" && dismissed !== state;
  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};
  const values = state.status === "error" ? state.values ?? {} : {};

  useEffect(() => {
    if (sent) headingRef.current?.focus();
  }, [sent]);

  if (sent) {
    return (
      <div className="grid place-items-start gap-[18px] py-[clamp(16px,3vw,40px)]" role="status">
        <div className="flex size-[52px] items-center justify-center bg-green">
          <Check size={26} strokeWidth={2.6} className="text-on-green" aria-hidden />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(22px,2.2vw,30px)] font-bold tracking-[-0.02em] outline-none">
          Enquiry received.
        </h2>
        <p className="max-w-[46ch] text-base leading-[1.7] text-body">
          Thank you — we have your brief. Expect a reply from the team within one working day. If it is urgent, call{" "}
          {company.phone} and ask for new business.
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(state);
            setFormKey((k) => k + 1);
          }}
          className="border border-ink px-6 py-3.5 font-display text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = (name: EnquiryField) => ({
    name,
    id: `enquiry-${name}`,
    defaultValue: values[name],
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `enquiry-${name}-error` : undefined,
  });

  const errorText = (name: EnquiryField) =>
    errors[name] && (
      <span id={`enquiry-${name}-error`} className="text-[13px] text-[#B42318]">
        {errors[name]}
      </span>
    );

  return (
    <div>
      <h2 className="text-[clamp(20px,2vw,26px)] font-bold tracking-[-0.02em]">Send a brief</h2>
      <p className="mt-2.5 text-[14.5px] leading-[1.6] text-muted">Fields marked with an asterisk are required.</p>

      <form key={formKey} action={formAction} noValidate className="mt-6 grid gap-4">
        {state.status === "error" && (
          <p role="alert" className="border-l-4 border-[#B42318] bg-[#FEF3F2] px-4 py-3 text-sm text-[#7A271A]">
            {state.message}
          </p>
        )}

        {/* Honeypot — hidden from people and assistive tech. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
          <label htmlFor="enquiry-name" className="grid gap-[7px]">
            <span className={labelCls}>NAME *</span>
            <input {...field("name")} required autoComplete="name" placeholder="Your full name" className={fieldCls} />
            {errorText("name")}
          </label>
          <label htmlFor="enquiry-company" className="grid gap-[7px]">
            <span className={labelCls}>COMPANY</span>
            <input {...field("company")} autoComplete="organization" placeholder="Business name" className={fieldCls} />
          </label>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
          <label htmlFor="enquiry-email" className="grid gap-[7px]">
            <span className={labelCls}>EMAIL *</span>
            <input
              {...field("email")}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.lk"
              className={fieldCls}
            />
            {errorText("email")}
          </label>
          <label htmlFor="enquiry-phone" className="grid gap-[7px]">
            <span className={labelCls}>PHONE</span>
            <input
              {...field("phone")}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+94 7X XXX XXXX"
              className={fieldCls}
            />
            {errorText("phone")}
          </label>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
          <label htmlFor="enquiry-service" className="grid gap-[7px]">
            <span className={labelCls}>SERVICE NEEDED</span>
            <select {...field("service")} className={fieldCls}>
              {enquiryServices.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label htmlFor="enquiry-budget" className="grid gap-[7px]">
            <span className={labelCls}>MONTHLY BUDGET</span>
            <select {...field("budget")} className={fieldCls}>
              {enquiryBudgets.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
        </div>

        <label htmlFor="enquiry-message" className="grid gap-[7px]">
          <span className={labelCls}>WHAT DO YOU NEED? *</span>
          <textarea
            {...field("message")}
            required
            rows={5}
            placeholder="The brand, the goal for the next quarter, and any deadlines we should know about."
            className={cn(fieldCls, "resize-y")}
          />
          {errorText("message")}
        </label>

        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center gap-2.5 bg-green px-[26px] py-4 font-display text-[15.5px] font-semibold text-on-green transition-colors hover:bg-green-hover disabled:cursor-wait disabled:opacity-80"
        >
          {pending ? (
            <>
              Sending
              <LoaderCircle size={17} className="animate-spin" aria-hidden />
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden />
            </>
          )}
        </button>
        <p className="text-[12.5px] leading-[1.6] text-caption">
          Your details stay with Idearigs and are used only to respond to this enquiry.
        </p>
      </form>
    </div>
  );
}
