import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'

export const projectCategory = defineType({
  name: 'projectCategory',
  title: 'Catégorie de projet',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({name: 'title', title: 'Nom', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 64},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [{title: 'Ordre', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})
