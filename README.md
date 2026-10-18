# Renov’Action

Marketing site for Renov’Action (renovation, Marseille & PACA).
Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Sanity (standalone Studio in `studio/`) · Motion.

## Getting started

```bash
cp .env.example .env.local   # fill in the Sanity tokens
npm install && npm --prefix studio install
npm run dev                  # site   → http://localhost:3000
npm run studio               # Studio → http://localhost:3333
```

| Script | Purpose |
| --- | --- |
| `npm run typegen` | Re-extract the schema and regenerate `src/sanity/types.ts` after changing schemas or GROQ queries |
| `npm run seed` | Re-create the initial content (copy from the brief + clearly labelled placeholder projects). Overwrites those documents. |
| `npm run build` / `typecheck` / `lint` | Production build and checks |

## Structure

- `studio/` — Sanity Studio: `schemaTypes/` (documents + objects), `structure/` (French desk structure, singletons), `presentation/` (Visual Editing locations)
- `src/sanity/lib` — client, `defineLive` setup (`loadQuery`), GROQ queries, image URL builder
- `src/components` — `layout/`, `home/`, `projects/`, `contact/`, `shared/` (BeforeAfterSlider, CTASection, CookieBanner, SanityImage…)
- `src/app/actions/contact.ts` — quote form server action

## Content model

Singletons: Paramètres du site, Accueil, À propos, Page Réalisations, Contact.
Collections: Projets, Catégories, Pages légales, Demandes de devis (written by the website form).

## Contact form

Validated with a shared zod schema (client + server). Spam protection: honeypot, minimum fill time, per-IP rate limit (best effort; add a firewall rule in production).
Each request is stored as a **Demande de devis** in Sanity. Set `RESEND_API_KEY`, `CONTACT_NOTIFICATION_EMAIL` and `CONTACT_FROM_EMAIL` to also receive an email.

## Cookies

The banner stores consent in a first-party `ra_consent` cookie (6 months). No analytics script is installed; gate any future one on `getConsent()?.analytics` from `src/lib/consent.ts`.

## Before going live

- Replace the "Projet exemple" projects and all placeholder (Unsplash) photos
- Fill in email, phone, address, Mentions légales and Politique de confidentialité
- Set `NEXT_PUBLIC_SITE_URL`, add the production URL to Sanity CORS origins, and set `SANITY_STUDIO_PREVIEW_ORIGIN` for the Studio
