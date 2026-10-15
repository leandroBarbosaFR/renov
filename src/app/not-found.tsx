import { ButtonLink } from "@/components/shared/ButtonLink";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[70svh] flex-col justify-center py-24">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="text-display mt-8 max-w-3xl">Cette page n’existe pas ou a été déplacée.</h1>
      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Retour à l’accueil</ButtonLink>
        <ButtonLink href="/realisations" variant="outline" arrow={false}>
          Voir nos réalisations
        </ButtonLink>
      </div>
    </section>
  );
}
