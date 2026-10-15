import {ThListIcon} from '@sanity/icons/ThList'
import {defineField, defineType} from 'sanity'

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Page Réalisations',
  type: 'document',
  icon: ThListIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 3}),
    defineField({name: 'allLabel', title: 'Libellé du filtre « tous »', type: 'string', initialValue: 'Tous les projets'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Page Réalisations'})},
})
