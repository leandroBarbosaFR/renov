import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Bouton',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'href',
      title: 'Lien',
      type: 'string',
      description: 'Chemin interne (/contact, /realisations, #devis) ou URL complète.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          return /^(\/|#|https?:\/\/|mailto:|tel:)/.test(value)
            ? true
            : 'Commencez par /, #, https://, mailto: ou tel:'
        }),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})
