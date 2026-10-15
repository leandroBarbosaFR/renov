import { cookies, draftMode } from "next/headers";
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from "next-sanity/live";
import type { ClientReturn, QueryParams } from "next-sanity";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
});

/** The app's single 'use cache' boundary around Sanity fetches. */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  "use cache";
  return sanityFetch(options);
};

export interface FetchOptions {
  perspective: LivePerspective;
  variant?: string;
  stega: boolean;
}

export const publishedOptions: FetchOptions = { perspective: "published", stega: false };

/** Resolves perspective/stega from Draft Mode. Call outside 'use cache' boundaries. */
export async function getFetchOptions(): Promise<FetchOptions> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return publishedOptions;

  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });
  const variant = await resolveVariantFromCookies({ cookies: jar });
  return { perspective: perspective ?? "drafts", variant, stega: true };
}

/**
 * Typed fetch through the cache boundary. Returns plain TypeGen result types;
 * in Draft Mode strings may carry stega markers, so `clean()` any value used in logic.
 */
export async function loadQuery<const QueryString extends string>({
  query,
  params,
  ...options
}: { query: QueryString; params?: QueryParams } & FetchOptions) {
  const { data } = await cachedSanity({ query, params, ...options });
  return { data: data as ClientReturn<QueryString, unknown> };
}
