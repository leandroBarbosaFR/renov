import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

/** Image with hotspot and mandatory alt text, used everywhere on the site. */
export const figure = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      type: 'string',
      description: 'Décrivez l’image pour les personnes malvoyantes et le référencement.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {asset?: unknown} | undefined
          return parent?.asset && !value ? 'Le texte alternatif est requis.' : true
        }),
    }),
    defineField({
      name: 'caption',
      title: 'Légende',
      type: 'string',
    }),
  ],
})
