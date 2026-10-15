import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Page légale',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'body', title: 'Contenu', type: 'blockContent'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
