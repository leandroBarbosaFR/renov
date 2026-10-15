import {CaseIcon} from '@sanity/icons/Case'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'main', title: 'Informations', default: true},
    {name: 'content', title: 'Contenu'},
    {name: 'media', title: 'Photos'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', group: 'main', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'location', title: 'Localisation', type: 'string', group: 'main', description: 'Ex. : Marseille 7e'}),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      group: 'main',
      to: [{type: 'projectCategory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'number',
      group: 'main',
      validation: (rule) => rule.integer().min(1950).max(2100),
    }),
    defineField({
      name: 'featured',
      title: 'Projet mis en avant',
      type: 'boolean',
      group: 'main',
      initialValue: false,
    }),
    defineField({
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      group: 'main',
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: 'details',
      title: 'Autres informations',
      type: 'array',
      group: 'main',
      description: 'Ex. : Surface — 85 m², Durée — 3 mois',
      of: [defineArrayMember({type: 'projectDetail'})],
    }),

    defineField({name: 'description', title: 'Description du projet', type: 'blockContent', group: 'content'}),
    defineField({name: 'objectives', title: 'Objectifs de la rénovation', type: 'blockContent', group: 'content'}),
    defineField({
      name: 'workPerformed',
      title: 'Travaux réalisés',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),

    defineField({
      name: 'featuredImage',
      title: 'Image principale',
      type: 'figure',
      group: 'media',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({type: 'galleryFull'}),
        defineArrayMember({type: 'galleryPair'}),
        defineArrayMember({type: 'galleryText'}),
      ],
    }),
    defineField({
      name: 'beforeImage',
      title: 'Image « avant »',
      type: 'figure',
      group: 'media',
      description: 'Le comparateur avant / après s’affiche lorsque les deux images sont renseignées.',
    }),
    defineField({name: 'afterImage', title: 'Image « après »', type: 'figure', group: 'media'}),

    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {title: 'Année (récent)', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
    {title: 'Titre', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', location: 'location', category: 'category.title', media: 'featuredImage', featured: 'featured'},
    prepare: ({title, location, category, media, featured}) => ({
      title: featured ? `★ ${title}` : title,
      subtitle: [category, location].filter(Boolean).join(' · '),
      media,
    }),
  },
})
