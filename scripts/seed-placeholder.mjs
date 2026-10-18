/**
 * Seeds initial content: copy from the project brief, and clearly labelled
 * placeholder projects with Unsplash photos so layouts can be reviewed.
 * Replace or delete the "Projet exemple" documents in the Studio once real projects exist.
 *
 * Usage: node --env-file=.env.local scripts/seed-placeholder.mjs
 * Idempotent: documents use fixed IDs and are replaced on each run.
 */
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const key = () => randomUUID().slice(0, 12);
const ref = (_ref) => ({ _type: "reference", _ref, _key: key() });
const block = (text, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});
const bullets = (items) =>
  items.map((text) => ({ ...block(text), listItem: "bullet", level: 1 }));

const PHOTOS = {
  heroVilla: "1512917774080-9991f1c4c750",
  aboutArches: "1600210491892-03d54c0aaf87",
  ctaKitchen: "1600585152220-90363fe7e115",
  formProvence: "1599809275671-b5942cabc7a2",
  beforeRoom: "1581858726788-75bc0f6a952d",
  afterRoom: "1513694203232-719a280e022f",
  villaPool: "1613490493576-7fde63acd811",
  villaGlass: "1582268611958-ebfd161ef9cf",
  villaInterior: "1600573472550-8090b5e0745e",
  villaFacade: "1580587771525-78b9dba3b914",
  aptLiving: "1600607687939-ce8a6c25118c",
  aptDining: "1604014237800-1c9102c219da",
  aptKitchen: "1600585152220-90363fe7e115",
  aptBath: "1600566752355-35792bedcfea",
  townLiving: "1600566753086-00f18fb6b3ea",
  townLounge: "1600210492486-724fe5c67fb0",
  townKitchen: "1600489000022-c2086d79f9d4",
  townBath: "1584622650111-993a426fbf0a",
};

const assetCache = new Map();
async function upload(id) {
  if (assetCache.has(id)) return assetCache.get(id);
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2400&q=80&fm=jpg`);
  if (!res.ok) throw new Error(`Unsplash ${id}: ${res.status}`);
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), {
    filename: `placeholder-${id}.jpg`,
    creditLine: "Photo Unsplash — image d’exemple à remplacer",
    source: { name: "unsplash", id, url: `https://unsplash.com/photos/${id}` },
  });
  assetCache.set(id, asset._id);
  return asset._id;
}

async function figure(photo, alt) {
  return { _type: "figure", asset: { _type: "reference", _ref: await upload(PHOTOS[photo]) }, alt };
}

async function main() {
  console.log("Uploading placeholder images…");
  for (const id of new Set(Object.values(PHOTOS))) await upload(id);

  const legal = [
    {
      _id: "legal-mentions-legales",
      _type: "legalPage",
      title: "Mentions légales",
      slug: { _type: "slug", current: "mentions-legales" },
      body: [
        block("Contenu à compléter par Renov’Action.", "h2"),
        block("Cette page doit notamment indiquer :"),
        ...bullets([
          "La dénomination sociale, la forme juridique et le capital social de l’entreprise",
          "L’adresse du siège social",
          "Le numéro d’immatriculation (SIRET / RCS) et le numéro de TVA intracommunautaire",
          "Le nom du directeur de la publication",
          "Les coordonnées de contact (email, téléphone)",
          "Le nom, l’adresse et le téléphone de l’hébergeur du site",
          "Les références de l’assurance professionnelle, le cas échéant",
        ]),
      ],
    },
    {
      _id: "legal-politique-de-confidentialite",
      _type: "legalPage",
      title: "Politique de confidentialité",
      slug: { _type: "slug", current: "politique-de-confidentialite" },
      body: [
        block("Contenu à compléter par Renov’Action.", "h2"),
        block(
          "Le formulaire de contact collecte : nom, prénom, email, téléphone, adresse, ville et code postal du chantier, délai et descriptif des travaux. Ces données servent uniquement à répondre à votre demande.",
        ),
        block("Cette page doit préciser :"),
        ...bullets([
          "L’identité du responsable du traitement",
          "La finalité et la base légale du traitement",
          "La durée de conservation des données",
          "Les destinataires et sous-traitants (hébergeur, CMS, service d’email)",
          "Les droits des personnes (accès, rectification, effacement, opposition) et la manière de les exercer",
          "L’utilisation des cookies et la gestion du consentement",
        ]),
      ],
    },
  ];

  const categories = [
    { _id: "category-renovation-complete", _type: "projectCategory", title: "Rénovation complète", slug: { _type: "slug", current: "renovation-complete" }, order: 1 },
    { _id: "category-interieur", _type: "projectCategory", title: "Intérieur", slug: { _type: "slug", current: "interieur" }, order: 2 },
    { _id: "category-exterieur", _type: "projectCategory", title: "Extérieur", slug: { _type: "slug", current: "exterieur" }, order: 3 },
  ];

  const placeholderNote = block(
    "Projet d’exemple : ce contenu et ces photos servent uniquement à la mise en page. Remplacez-les par une réalisation réelle depuis le Studio.",
  );

  const projects = [
    {
      _id: "project-exemple-villa",
      _type: "project",
      title: "Projet exemple · Villa avec piscine",
      slug: { _type: "slug", current: "exemple-villa-avec-piscine" },
      location: "Localisation à préciser",
      category: { _type: "reference", _ref: "category-exterieur" },
      featured: true,
      excerpt: "Projet d’exemple à remplacer par une réalisation réelle.",
      details: [{ _key: key(), _type: "projectDetail", label: "Statut", value: "Contenu d’exemple" }],
      description: [placeholderNote],
      workPerformed: ["Exemple de prestation", "Exemple de prestation", "Exemple de prestation"],
      featuredImage: await figure("villaPool", "Villa contemporaine blanche avec piscine (image d’exemple)"),
      gallery: [
        { _key: key(), _type: "galleryFull", image: await figure("villaGlass", "Maison de plain-pied ouverte sur une piscine (image d’exemple)") },
        {
          _key: key(),
          _type: "galleryPair",
          left: await figure("villaInterior", "Séjour baigné de lumière donnant sur la terrasse (image d’exemple)"),
          right: await figure("villaFacade", "Façade contemporaine et piscine (image d’exemple)"),
        },
      ],
    },
    {
      _id: "project-exemple-appartement",
      _type: "project",
      title: "Projet exemple · Appartement lumineux",
      slug: { _type: "slug", current: "exemple-appartement-lumineux" },
      location: "Localisation à préciser",
      category: { _type: "reference", _ref: "category-interieur" },
      featured: true,
      excerpt: "Projet d’exemple à remplacer par une réalisation réelle.",
      details: [{ _key: key(), _type: "projectDetail", label: "Statut", value: "Contenu d’exemple" }],
      description: [placeholderNote],
      workPerformed: ["Exemple de prestation", "Exemple de prestation"],
      featuredImage: await figure("aptLiving", "Séjour contemporain avec mur en bois (image d’exemple)"),
      gallery: [
        {
          _key: key(),
          _type: "galleryText",
          image: await figure("aptDining", "Espace repas ouvert sur le séjour (image d’exemple)"),
          title: "Exemple de bloc image et texte",
          text: "Ce bloc associe une photo à un court texte éditorial. Il se configure depuis la galerie du projet dans le Studio.",
          imagePosition: "left",
        },
        {
          _key: key(),
          _type: "galleryPair",
          left: await figure("aptKitchen", "Cuisine blanche avec îlot central (image d’exemple)"),
          right: await figure("aptBath", "Salle de bain sombre avec baignoire îlot (image d’exemple)"),
        },
      ],
    },
    {
      _id: "project-exemple-maison",
      _type: "project",
      title: "Projet exemple · Maison de ville",
      slug: { _type: "slug", current: "exemple-maison-de-ville" },
      location: "Localisation à préciser",
      category: { _type: "reference", _ref: "category-renovation-complete" },
      featured: true,
      excerpt: "Projet d’exemple à remplacer par une réalisation réelle.",
      details: [{ _key: key(), _type: "projectDetail", label: "Statut", value: "Contenu d’exemple" }],
      description: [placeholderNote],
      workPerformed: ["Exemple de prestation", "Exemple de prestation", "Exemple de prestation"],
      featuredImage: await figure("townLiving", "Séjour double hauteur avec escalier (image d’exemple)"),
      gallery: [
        { _key: key(), _type: "galleryFull", image: await figure("townLounge", "Salon chaleureux aux tons naturels (image d’exemple)") },
        {
          _key: key(),
          _type: "galleryPair",
          left: await figure("townKitchen", "Cuisine aux façades sombres et étagères ouvertes (image d’exemple)"),
          right: await figure("townBath", "Salle de bain avec douche à l’italienne (image d’exemple)"),
        },
      ],
      beforeImage: await figure("beforeRoom", "Pièce vide avant travaux (image d’exemple)"),
      afterImage: await figure("afterRoom", "Pièce aménagée après travaux (image d’exemple)"),
    },
  ];

  const settings = {
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: "Renov’Action",
    tagline: "Votre partenaire rénovation à Marseille et dans les Bouches-du-Rhône.",
    footerDescription: "Votre partenaire rénovation à Marseille et dans les Bouches-du-Rhône.",
    serviceArea: "Marseille et région PACA",
    areasServed: ["Marseille", "Bouches-du-Rhône", "Provence-Alpes-Côte d’Azur"],
    navigation: [
      { _key: key(), _type: "navItem", label: "Accueil", href: "/" },
      { _key: key(), _type: "navItem", label: "À propos", href: "/a-propos" },
      { _key: key(), _type: "navItem", label: "Réalisations", href: "/realisations" },
      { _key: key(), _type: "navItem", label: "Contact", href: "/contact" },
    ],
    headerCta: { _type: "cta", label: "Demander un devis", href: "/contact" },
    contactCta: {
      title: "Un projet de rénovation en tête ?",
      description: "Parlons de votre projet et imaginons ensemble la transformation de votre espace.",
      image: await figure("ctaKitchen", "Cuisine contemporaine lumineuse avec îlot (image d’exemple)"),
      cta: { _type: "cta", label: "Demander un devis", href: "/contact" },
    },
    legalLinks: legal.map((l) => ref(l._id)),
    cookieBanner: {
      title: "Vos préférences cookies",
      text: "Nous utilisons des cookies nécessaires au bon fonctionnement du site. Avec votre accord, des cookies de mesure d’audience peuvent nous aider à l’améliorer.",
      privacyPage: { _type: "reference", _ref: "legal-politique-de-confidentialite" },
    },
    seo: {
      _type: "seo",
      metaTitle: "Renov’Action — Rénovation à Marseille et en PACA",
      metaDescription:
        "Renov’Action accompagne vos projets de rénovation à Marseille et dans toute la région PACA, avec exigence, savoir-faire et attention aux détails.",
    },
  };

  const home = {
    _id: "homePage",
    _type: "homePage",
    hero: {
      eyebrow: "Rénovation · Marseille & PACA",
      title: "Redonnons vie à vos espaces.",
      description:
        "Nous transformons vos espaces de vie avec exigence, savoir-faire et attention aux détails. Des projets de rénovation pensés pour vous, à Marseille et dans toute la région PACA.",
      image: await figure("heroVilla", "Villa méditerranéenne blanche rénovée avec piscine (image d’exemple)"),
      primaryCta: { _type: "cta", label: "Parlons de votre projet", href: "#devis" },
      secondaryCta: { _type: "cta", label: "Découvrir nos réalisations", href: "/realisations" },
    },
    about: {
      eyebrow: "01 / À propos",
      title: "Des espaces repensés avec précision.",
      description:
        "Chez Renov’Action, nous accompagnons chaque projet de rénovation avec une approche sur mesure, un souci du détail et une attention particulière à la qualité des finitions.",
      values: ["Un accompagnement personnalisé", "Une attention portée aux détails", "Des réalisations pensées pour durer"],
      image: await figure("aboutArches", "Séjour aux fenêtres en arche et poutres apparentes (image d’exemple)"),
      cta: { _type: "cta", label: "En savoir plus", href: "/a-propos" },
    },
    projects: {
      title: "Nos réalisations",
      subtitle: "Découvrez des espaces transformés, où chaque détail compte.",
      featuredProjects: projects.map((p) => ref(p._id)),
      cta: { _type: "cta", label: "Voir toutes nos réalisations", href: "/realisations" },
    },
    beforeAfter: {
      eyebrow: "La transformation",
      title: "Voyez la différence.",
      description:
        "Découvrez comment nous transformons des espaces existants en lieux de vie modernes, fonctionnels et harmonieux.",
      project: { _type: "reference", _ref: "project-exemple-maison" },
      cta: { _type: "cta", label: "Découvrir nos réalisations", href: "/realisations" },
    },
    showContactForm: true,
  };

  const about = {
    _id: "aboutPage",
    _type: "aboutPage",
    eyebrow: "À propos",
    title: "Des espaces repensés avec précision.",
    intro:
      "Chez Renov’Action, nous accompagnons chaque projet de rénovation avec une approche sur mesure, un souci du détail et une attention particulière à la qualité des finitions.",
    heroImage: await figure("aboutArches", "Séjour aux fenêtres en arche et poutres apparentes (image d’exemple)"),
    sections: [
      {
        _key: key(),
        _type: "aboutSection",
        eyebrow: "01 / Approche",
        title: "Chaque projet commence par l’écoute.",
        body: [
          block(
            "Texte à personnaliser : présentez ici votre façon de travailler, de la première visite à la livraison du chantier.",
          ),
        ],
        image: await figure("townLounge", "Salon chaleureux aux tons naturels (image d’exemple)"),
      },
      {
        _key: key(),
        _type: "aboutSection",
        eyebrow: "02 / Savoir-faire",
        title: "La qualité se joue dans les détails.",
        body: [
          block(
            "Texte à personnaliser : décrivez vos domaines d’intervention, vos matériaux de prédilection et ce qui fait la singularité de vos réalisations.",
          ),
        ],
        image: await figure("aptKitchen", "Cuisine blanche avec îlot central (image d’exemple)"),
      },
    ],
    valuesTitle: "Nos engagements",
    values: [
      { _key: key(), _type: "valueItem", title: "Un accompagnement personnalisé", description: "Un interlocuteur à votre écoute, du premier échange à la fin des travaux." },
      { _key: key(), _type: "valueItem", title: "Une attention portée aux détails", description: "Des finitions soignées et des choix de matériaux réfléchis." },
      { _key: key(), _type: "valueItem", title: "Des réalisations pensées pour durer", description: "Des espaces conçus pour accompagner votre quotidien dans le temps." },
    ],
  };

  const projectsPage = {
    _id: "projectsPage",
    _type: "projectsPage",
    eyebrow: "Portfolio",
    title: "Nos réalisations",
    intro: "Chaque projet est une nouvelle façon de repenser les espaces et de valoriser l’existant.",
    allLabel: "Tous les projets",
  };

  const contact = {
    _id: "contactPage",
    _type: "contactPage",
    eyebrow: "Demande de devis",
    title: "Un projet de rénovation en tête ?",
    intro: "Parlons de votre projet et imaginons ensemble la transformation de votre espace.",
    formTitle: "Décrivez-nous votre projet, nous revenons vers vous pour fixer un rendez-vous.",
    formBackground: await figure("formProvence", "Maison provençale avec terrasse et piscine au coucher du soleil (image d’exemple)"),
    timeframes: ["Dès que possible", "Dans les 3 mois", "Dans les 6 mois", "Dans plus de 6 mois", "Je ne sais pas encore"],
    renovationTypes: ["Rénovation complète", "Rénovation intérieure", "Cuisine", "Salle de bain", "Extérieur / façade", "Autre"],
    submitLabel: "Envoyer ma demande",
    consentText: "J’accepte que les informations saisies soient utilisées pour être recontacté(e) au sujet de mon projet.",
    successTitle: "Merci, votre demande a bien été envoyée.",
    successMessage: "Nous revenons vers vous rapidement pour échanger sur votre projet.",
  };

  const tx = client.transaction();
  for (const doc of [...legal, ...categories, ...projects, settings, home, about, projectsPage, contact]) {
    tx.createOrReplace(doc);
  }
  await tx.commit();
  console.log("Seeded", legal.length + categories.length + projects.length + 5, "documents.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
