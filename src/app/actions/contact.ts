"use server";

import { headers } from "next/headers";
import { contactSchema, toFieldErrors, type ContactInput, type ContactState } from "@/lib/contact/schema";
import { getWriteClient } from "@/sanity/lib/writeClient";

const MIN_FILL_MS = 3_000;
const MAX_FILL_MS = 1000 * 60 * 60 * 24;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Best-effort, per-instance rate limiting. Pair with platform firewall rules in production.
const attempts = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 5_000) attempts.clear();
  return recent.length > RATE_LIMIT;
}

const GENERIC_ERROR =
  "Votre demande n’a pas pu être envoyée. Merci de réessayer dans quelques instants ou de nous contacter directement.";

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field. Pretend success to bots.
  if (String(formData.get("website") ?? "").length > 0) return { status: "success" };

  const startedAt = Number(formData.get("startedAt"));
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return { status: "error", message: "Merci de vérifier le formulaire puis de l’envoyer à nouveau." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return { status: "error", message: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes." };
  }

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Certains champs sont à corriger.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const sourcePage = String(formData.get("sourcePage") ?? "").slice(0, 200);

  const [stored, emailed] = await Promise.all([storeSubmission(data, sourcePage), sendNotification(data)]);
  if (!stored && !emailed) return { status: "error", message: GENERIC_ERROR };

  return { status: "success" };
}

async function storeSubmission(data: ContactInput, sourcePage: string) {
  const client = getWriteClient();
  if (!client) return false;
  try {
    await client.create({
      _type: "contactSubmission",
      status: "new",
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      timeframe: data.timeframe,
      renovationType: data.renovationType || undefined,
      message: data.message,
      sourcePage,
      submittedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("[contact] Failed to store submission", error);
    return false;
  }
}

/** Optional email alert via Resend, enabled when RESEND_API_KEY and both addresses are set. */
async function sendNotification(data: ContactInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return false;

  const lines = [
    `Nom : ${data.lastName}`,
    `Prénom : ${data.firstName}`,
    `Email : ${data.email}`,
    `Téléphone : ${data.phone}`,
    `Adresse du chantier : ${data.address}, ${data.postalCode} ${data.city}`,
    data.renovationType ? `Type de rénovation : ${data.renovationType}` : null,
    `Délai souhaité : ${data.timeframe}`,
    "",
    data.message,
  ].filter((l) => l !== null);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `Nouvelle demande de devis — ${data.firstName} ${data.lastName} (${data.city})`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) console.error("[contact] Email notification failed", res.status, await res.text());
    return res.ok;
  } catch (error) {
    console.error("[contact] Email notification failed", error);
    return false;
  }
}
