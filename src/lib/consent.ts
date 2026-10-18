/**
 * First-party cookie consent store.
 * Necessary cookies are always on; optional categories default to off until accepted.
 * Gate any future analytics/marketing script on `getConsent()?.analytics === true`.
 */

export interface Consent {
  analytics: boolean;
  updatedAt: string;
  version: 1;
}

const COOKIE = "ra_consent";
const MAX_AGE = 60 * 60 * 24 * 182; // ~6 months, per CNIL recommendations
const CHANGE_EVENT = "ra:consent-change";
const OPEN_EVENT = "ra:consent-open";

export function getConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as Consent;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: Pick<Consent, "analytics">) {
  const value: Consent = { analytics: choice.analytics, updatedAt: new Date().toISOString(), version: 1 };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
}

export function onConsentChange(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentOpen(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}
