import { Suspense } from "react";
import { draftMode } from "next/headers";
import { getFetchOptions, publishedOptions, type FetchOptions } from "./live";

type Render = (options: FetchOptions) => React.ReactNode;

/**
 * Renders cached, published content by default. In Draft Mode, resolves the
 * perspective from cookies inside a Suspense boundary (required by Cache Components).
 */
export async function WithFetchOptions({ render, fallback = null }: { render: Render; fallback?: React.ReactNode }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return render(publishedOptions);
  return (
    <Suspense fallback={fallback}>
      <DraftContent render={render} />
    </Suspense>
  );
}

async function DraftContent({ render }: { render: Render }) {
  return render(await getFetchOptions());
}
