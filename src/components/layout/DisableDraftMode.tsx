"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  // Hidden inside the Studio's Presentation tool, and while still detecting (null)
  if (isPresentationTool !== false) return null;
  return (
    // A full page load is required so the route handler can clear the draft cookie.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 left-4 z-[70] rounded-card bg-ink px-4 py-2 text-sm text-sand"
    >
      Quitter l’aperçu
    </a>
  );
}
