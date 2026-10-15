import {UsersIcon} from '@sanity/icons/Users'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'À propos',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'content', title: 'Contenu', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'eyebrow', title: 'Surtitre', type: 'string', group: 'content'}),
    defineField({name: 'title', title: 'Titre', type: 'string', group: 'content', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'heroImage', title: 'Image principale', type: 'figure', group: 'content'}),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'aboutSection',
          title: 'Section',
          type: 'object',
          fields: [
            defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
            defineField({name: 'title', title: 'Titre', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'body', title: 'Texte', type: 'blockContent'}),
            defineField({name: 'image', title: 'Image', type: 'figure'}),
          ],
          preview: {select: {title: 'title', subtitle: 'eyebrow', media: 'image'}},
        }),
      ],
    }),
    defineField({name: 'valuesTitle', title: 'Titre des valeurs', type: 'string', group: 'content'}),
    defineField({
      name: 'values',
      title: 'Valeurs',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'valueItem'})],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'À propos'})},
})
