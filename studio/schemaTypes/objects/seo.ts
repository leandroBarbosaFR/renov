import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Titre (meta title)',
      type: 'string',
      validation: (rule) => rule.max(60).warning('Idéalement moins de 60 caractères.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description (meta description)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Idéalement moins de 160 caractères.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Image de partage (Open Graph)',
      type: 'image',
      description: 'Format recommandé : 1200 × 630 px.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'URL canonique',
      type: 'url',
      description: 'À renseigner uniquement si le contenu est publié ailleurs.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Masquer des moteurs de recherche',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
