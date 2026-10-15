import { stegaClean } from "next-sanity";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Removes Visual Editing (stega) markers from strings used in logic, attributes or metadata. */
export function clean<T>(value: T): T {
  return stegaClean(value) as T;
}

export function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function telHref(phone: string) {
  return `tel:${clean(phone).replace(/[^\d+]/g, "")}`;
}
