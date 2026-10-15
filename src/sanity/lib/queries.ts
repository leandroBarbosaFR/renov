import { defineQuery } from "next-sanity";

const image = /* groq */ `
  _type,
  asset,
  hotspot,
  crop,
  alt,
  caption,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
`;

const cta = /* groq */ `label, href`;

const seo = /* groq */ `
  metaTitle,
  metaDescription,
  canonicalUrl,
  noIndex,
  "ogImage": ogImage.asset->url
`;

const projectCard = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  location,
  year,
  excerpt,
  "category": category->{ title, "slug": slug.current },
  featuredImage { ${image} }
`;

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    companyName,
    logo { ${image} },
    tagline,
    email,
    phone,
    address,
    serviceArea,
    areasServed,
    socialLinks[]{ _key, platform, url },
    navigation[]{ _key, label, href },
    headerCta { ${cta} },
    contactCta {
      title,
      description,
      image { ${image} },
      cta { ${cta} }
    },
    footerDescription,
    legalLinks[]->{ _id, title, "slug": slug.current },
    cookieBanner {
      title,
      text,
      "privacySlug": privacyPage->slug.current
    },
    seo { ${seo} }
  }
`);

export const HOME_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{
    hero {
      eyebrow,
      title,
      description,
      image { ${image} },
      primaryCta { ${cta} },
      secondaryCta { ${cta} }
    },
    about {
      eyebrow,
      title,
      description,
      values,
      image { ${image} },
      cta { ${cta} }
    },
    projects {
      title,
      subtitle,
      cta { ${cta} },
      "items": select(
        count(featuredProjects) > 0 => featuredProjects[]->{ ${projectCard} },
        *[_type == "project" && featured == true && defined(slug.current)]
          | order(year desc, _createdAt desc)[0...3]{ ${projectCard} }
      )
    },
    beforeAfter {
      eyebrow,
      title,
      description,
      cta { ${cta} },
      "beforeImage": coalesce(beforeImage, project->beforeImage) { ${image} },
      "afterImage": coalesce(afterImage, project->afterImage) { ${image} }
    },
    showContactForm,
    seo { ${seo} }
  }
`);

export const ABOUT_QUERY = defineQuery(`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    eyebrow,
    title,
    intro,
    heroImage { ${image} },
    sections[]{
      _key,
      eyebrow,
      title,
      body,
      image { ${image} }
    },
    valuesTitle,
    values[]{ _key, title, description },
    seo { ${seo} }
  }
`);

export const PROJECTS_PAGE_QUERY = defineQuery(`
  {
    "page": *[_type == "projectsPage" && _id == "projectsPage"][0]{
      eyebrow,
      title,
      intro,
      allLabel,
      seo { ${seo} }
    },
    "categories": *[_type == "projectCategory" && count(*[_type == "project" && references(^._id)]) > 0]
      | order(order asc, title asc){ _id, title, "slug": slug.current },
    "projects": *[_type == "project" && defined(slug.current)]
      | order(year desc, _createdAt desc){ ${projectCard} }
  }
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    location,
    year,
    excerpt,
    "category": category->{ title, "slug": slug.current },
    details[]{ _key, label, value },
    description,
    objectives,
    workPerformed,
    featuredImage { ${image} },
    gallery[]{
      _key,
      _type,
      _type == "galleryFull" => { image { ${image} } },
      _type == "galleryPair" => { left { ${image} }, right { ${image} } },
      _type == "galleryText" => { title, text, imagePosition, image { ${image} } }
    },
    beforeImage { ${image} },
    afterImage { ${image} },
    seo { ${seo} },
    "next": coalesce(
      *[_type == "project" && defined(slug.current) && _id != ^._id && _createdAt < ^._createdAt]
        | order(_createdAt desc)[0],
      *[_type == "project" && defined(slug.current) && _id != ^._id]
        | order(_createdAt desc)[0]
    ){ ${projectCard} }
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`);

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage" && _id == "contactPage"][0]{
    eyebrow,
    title,
    intro,
    formTitle,
    formBackground { ${image} },
    timeframes,
    renovationTypes,
    submitLabel,
    consentText,
    successTitle,
    successMessage,
    seo { ${seo} }
  }
`);

export const LEGAL_PAGE_QUERY = defineQuery(`
  *[_type == "legalPage" && slug.current == $slug][0]{
    title,
    body,
    _updatedAt,
    seo { ${seo} }
  }
`);

export const LEGAL_SLUGS_QUERY = defineQuery(`
  *[_type == "legalPage" && defined(slug.current)]{ "slug": slug.current }
`);

export const SITEMAP_QUERY = defineQuery(`
  {
    "projects": *[_type == "project" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt },
    "legal": *[_type == "legalPage" && defined(slug.current) && seo.noIndex != true]{ "slug": slug.current, _updatedAt }
  }
`);
