export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";

export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined || value === "") throw new Error(message);
  return value;
}
