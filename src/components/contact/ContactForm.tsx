"use client";

import { useActionState, useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { submitContact } from "@/app/actions/contact";
import {
  contactSchema,
  toFieldErrors,
  type ContactField,
  type ContactState,
  type FieldErrors,
} from "@/lib/contact/schema";
import { cn } from "@/lib/utils";
import { SlideToSubmit } from "./SlideToSubmit";

const initialState: ContactState = { status: "idle" };

export interface ContactFormContent {
  formTitle?: string | null;
  timeframes?: string[] | null;
  renovationTypes?: string[] | null;
  submitLabel?: string | null;
  consentText?: string | null;
  successTitle?: string | null;
  successMessage?: string | null;
  privacySlug?: string | null;
}

const DEFAULT_TIMEFRAMES = ["Dès que possible", "Dans les 3 mois", "Dans les 6 mois", "Dans plus de 6 mois", "Je ne sais pas encore"];

export function ContactForm({ content, headingLevel = "h2" }: { content: ContactFormContent; headingLevel?: "h2" | "h3" }) {
  const [state, dispatch] = useActionState(submitContact, initialState);
  const [isPending, startTransition] = useTransition();
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [resetKey, setResetKey] = useState(0);
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const startedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();
  const statusId = useId();

  const timeframes = content.timeframes?.length ? content.timeframes : DEFAULT_TIMEFRAMES;
  const renovationTypes = content.renovationTypes ?? [];
  const errors: FieldErrors = { ...(state.fieldErrors ?? {}), ...clientErrors };
  const Heading = headingLevel;

  const markStarted = () => {
    if (startedAt.current === null) startedAt.current = Date.now();
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("startedAt", String(startedAt.current ?? 0));
    formData.set("sourcePage", pathname);

    const result = contactSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error);
      setClientErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors({});
    // Dispatching manually (instead of <form action>) keeps the values if the server rejects them.
    startTransition(() => dispatch(formData));
  };

  const clearError = (name: ContactField) => {
    if (!clientErrors[name]) return;
    setClientErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  if (state.status === "success" && state !== dismissed) {
    return (
      <div role="status" className="flex min-h-[28rem] flex-col items-start justify-center py-6">
        <span className="flex size-12 items-center justify-center rounded-card bg-olive text-sand">
          <Check aria-hidden strokeWidth={1.5} className="size-5" />
        </span>
        <Heading className="text-h3 mt-8">{content.successTitle || "Merci, votre demande a bien été envoyée."}</Heading>
        <p className="mt-4 max-w-md leading-relaxed text-stone">
          {content.successMessage || "Nous revenons vers vous rapidement pour échanger sur votre projet."}
        </p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = null;
            setDismissed(state);
            setResetKey((k) => k + 1);
          }}
          className="mt-10 text-sm text-stone underline underline-offset-4 hover:text-ink"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form
      key={resetKey}
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onFocus={markStarted}
      onPointerDown={markStarted}
      aria-describedby={statusId}
      className="flex flex-col"
    >
      <Heading className="text-h3 max-w-xl">{content.formTitle || "Parlons de votre projet"}</Heading>
      <p className="mt-4 text-[0.8125rem] text-stone">« * » indique les champs nécessaires</p>

      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <Field name="lastName" label="Nom" autoComplete="family-name" error={errors.lastName} onInput={clearError} />
        <Field name="firstName" label="Prénom" autoComplete="given-name" error={errors.firstName} onInput={clearError} />
        <Field name="email" label="Email" type="email" autoComplete="email" error={errors.email} onInput={clearError} />
        <Field name="phone" label="Téléphone" type="tel" autoComplete="tel" error={errors.phone} onInput={clearError} />
        <Field
          name="address"
          label="Adresse du chantier"
          autoComplete="street-address"
          error={errors.address}
          onInput={clearError}
          className="sm:col-span-2"
        />
        <Field name="city" label="Ville" autoComplete="address-level2" error={errors.city} onInput={clearError} />
        <Field
          name="postalCode"
          label="Code postal"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          error={errors.postalCode}
          onInput={clearError}
        />

        {renovationTypes.length > 0 && (
          <SelectField
            name="renovationType"
            label="Type de rénovation"
            optional
            options={renovationTypes}
            placeholder="Sélectionnez"
            error={errors.renovationType}
            onInput={clearError}
            className="sm:col-span-2"
          />
        )}

        <SelectField
          name="timeframe"
          label="Quand souhaitez-vous réaliser vos travaux ?"
          options={timeframes}
          defaultValue={timeframes[0]}
          error={errors.timeframe}
          onInput={clearError}
          className="sm:col-span-2"
        />

        <div className="sm:col-span-2">
          <Label htmlFor="cf-message" required>
            Descriptif des travaux
          </Label>
          <textarea
            id="cf-message"
            name="message"
            rows={7}
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "cf-message-error" : undefined}
            onInput={() => clearError("message")}
            className={cn(inputClass(!!errors.message), "min-h-40 resize-y py-3.5 leading-relaxed")}
          />
          <FieldError id="cf-message-error" message={errors.message} />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-relaxed text-stone">
            <input
              type="checkbox"
              name="consent"
              required
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "cf-consent-error" : undefined}
              onChange={() => clearError("consent")}
              className="mt-0.5 size-4 shrink-0 appearance-none rounded-[1px] border border-ink/50 bg-paper bg-center bg-no-repeat checked:border-olive checked:bg-olive checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2016%2016%22%20fill=%22none%22%20stroke=%22%23F4F0E8%22%20stroke-width=%222%22%3E%3Cpath%20d=%22M3.5%208.5l3%203%206-7%22/%3E%3C/svg%3E')]"
            />
            <span>
              {content.consentText ||
                "J’accepte que les informations saisies soient utilisées pour être recontacté(e) au sujet de mon projet."}{" "}
              {content.privacySlug && (
                <Link href={`/${content.privacySlug}`} className="text-ink underline underline-offset-2">
                  Politique de confidentialité
                </Link>
              )}
              <span aria-hidden className="text-accent-deep"> *</span>
            </span>
          </label>
          <FieldError id="cf-consent-error" message={errors.consent} />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-start">
        <SlideToSubmit label={content.submitLabel || "Envoyer ma demande"} pending={isPending} />
        <p id={statusId} role="alert" aria-live="polite" className="text-sm text-[#9b3b2f] sm:pt-4">
          {state.status === "error" && !isPending ? state.message : null}
        </p>
      </div>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "block w-full rounded-card border bg-paper/80 px-4 text-[0.9375rem] text-ink transition-colors duration-200 placeholder:text-stone/60",
    "focus:border-ink focus:bg-paper focus:outline-none",
    invalid ? "border-[#9b3b2f]" : "border-ink/20 hover:border-ink/40",
  );
}

function Label({ htmlFor, children, required, optional }: { htmlFor: string; children: React.ReactNode; required?: boolean; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2.5 block text-[0.75rem] font-medium uppercase tracking-[0.12em] text-ink">
      {children}
      {required && <span aria-hidden className="text-accent-deep"> *</span>}
      {optional && <span className="ml-1 normal-case tracking-normal text-stone">(facultatif)</span>}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-[0.8125rem] text-[#9b3b2f]">
      {message}
    </p>
  );
}

function Field({
  name,
  label,
  type = "text",
  error,
  onInput,
  className,
  ...rest
}: {
  name: ContactField;
  label: string;
  type?: string;
  error?: string;
  onInput: (name: ContactField) => void;
  className?: string;
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, "autoComplete" | "inputMode" | "maxLength">) {
  const id = `cf-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} required>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        required
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onInput={() => onInput(name)}
        className={cn(inputClass(!!error), "h-12")}
        {...rest}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  placeholder,
  defaultValue,
  optional,
  error,
  onInput,
  className,
}: {
  name: ContactField;
  label: string;
  options: string[];
  placeholder?: string;
  defaultValue?: string;
  optional?: boolean;
  error?: string;
  onInput: (name: ContactField) => void;
  className?: string;
}) {
  const id = `cf-${name}`;
  return (
    <div className={className}>
      <Label htmlFor={id} required={!optional} optional={optional}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={!optional}
          defaultValue={defaultValue ?? ""}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={() => onInput(name)}
          className={cn(inputClass(!!error), "h-12 cursor-pointer appearance-none pr-12")}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink"
        />
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
