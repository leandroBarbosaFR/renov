import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    {route: '/', filter: `_type == "homePage" && _id == "homePage"`},
    {route: '/a-propos', filter: `_type == "aboutPage" && _id == "aboutPage"`},
    {route: '/realisations', filter: `_type == "projectsPage" && _id == "projectsPage"`},
    {route: '/contact', filter: `_type == "contactPage" && _id == "contactPage"`},
    {route: '/realisations/:slug', filter: `_type == "project" && slug.current == $slug`},
    {route: '/:slug', filter: `_type == "legalPage" && slug.current == $slug`},
  ]),
  locations: {
    homePage: defineLocations({message: 'Page d’accueil', locations: [{title: 'Accueil', href: '/'}]}),
    aboutPage: defineLocations({locations: [{title: 'À propos', href: '/a-propos'}]}),
    projectsPage: defineLocations({locations: [{title: 'Réalisations', href: '/realisations'}]}),
    contactPage: defineLocations({
      locations: [
        {title: 'Contact', href: '/contact'},
        {title: 'Accueil (formulaire)', href: '/'},
      ],
    }),
    siteSettings: defineLocations({message: 'Utilisé sur toutes les pages', locations: [{title: 'Accueil', href: '/'}]}),
    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Projet', href: `/realisations/${doc?.slug}`},
          {title: 'Réalisations', href: '/realisations'},
        ],
      }),
    }),
    legalPage: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({locations: [{title: doc?.title || 'Page', href: `/${doc?.slug}`}]}),
    }),
  },
}
