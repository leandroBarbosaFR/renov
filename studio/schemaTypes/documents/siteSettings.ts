import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identité', default: true},
    {name: 'contact', title: 'Coordonnées'},
    {name: 'navigation', title: 'Navigation'},
    {name: 'cta', title: 'Appel à l’action'},
    {name: 'footer', title: 'Pied de page'},
    {name: 'cookies', title: 'Cookies'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'companyName',
      title: 'Nom de l’entreprise',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'figure',
      group: 'identity',
      description: 'Facultatif. Sans logo, le nom est affiché avec la typographie du site.',
    }),
    defineField({
      name: 'tagline',
      title: 'Description courte',
      type: 'text',
      rows: 2,
      group: 'identity',
    }),

    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (rule) => rule.email()}),
    defineField({name: 'phone', title: 'Téléphone', type: 'string', group: 'contact'}),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'object',
      group: 'contact',
      description: 'Utilisée pour les données structurées (Google). Ne renseignez que des informations vérifiées.',
      fields: [
        defineField({name: 'street', title: 'Rue', type: 'string'}),
        defineField({name: 'postalCode', title: 'Code postal', type: 'string'}),
        defineField({name: 'city', title: 'Ville', type: 'string'}),
      ],
    }),
    defineField({
      name: 'serviceArea',
      title: 'Zone d’intervention',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'areasServed',
      title: 'Villes / zones desservies (SEO)',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'socialLink'})],
    }),

    defineField({
      name: 'navigation',
      title: 'Menu principal',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({type: 'navItem'})],
    }),
    defineField({name: 'headerCta', title: 'Bouton du menu', type: 'cta', group: 'navigation'}),

    defineField({
      name: 'contactCta',
      title: 'Bloc « Un projet en tête ? »',
      type: 'object',
      group: 'cta',
      description: 'Affiché avant le pied de page sur les pages intérieures.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'image', title: 'Image', type: 'figure'}),
        defineField({name: 'cta', title: 'Bouton', type: 'cta'}),
      ],
    }),

    defineField({name: 'footerDescription', title: 'Texte du pied de page', type: 'text', rows: 2, group: 'footer'}),
    defineField({
      name: 'legalLinks',
      title: 'Pages légales',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'reference', to: [{type: 'legalPage'}]})],
    }),

    defineField({
      name: 'cookieBanner',
      title: 'Bandeau cookies',
      type: 'object',
      group: 'cookies',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({name: 'text', title: 'Texte', type: 'text', rows: 3}),
        defineField({
          name: 'privacyPage',
          title: 'Page de politique de confidentialité',
          type: 'reference',
          to: [{type: 'legalPage'}],
        }),
      ],
    }),

    defineField({name: 'seo', title: 'SEO par défaut', type: 'seo', group: 'seo', options: {collapsed: false}}),
  ],
  preview: {prepare: () => ({title: 'Paramètres du site'})},
})
