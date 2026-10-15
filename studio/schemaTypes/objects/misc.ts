import {defineField, defineType} from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Lien de navigation',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Libellé', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'href',
      title: 'Chemin',
      type: 'string',
      description: 'Ex. : /, /a-propos, /realisations, /contact',
      validation: (rule) => rule.required().regex(/^(\/|https?:\/\/)/, {name: 'chemin ou URL'}),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Réseau social',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Plateforme',
      type: 'string',
      options: {
        list: ['Instagram', 'Facebook', 'LinkedIn', 'Pinterest', 'Houzz', 'YouTube'].map((value) => ({
          title: value,
          value,
        })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'url', title: 'URL', type: 'url', validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'platform', subtitle: 'url'}},
})

export const projectDetail = defineType({
  name: 'projectDetail',
  title: 'Information',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Libellé', type: 'string', description: 'Ex. : Surface, Durée', validation: (rule) => rule.required()}),
    defineField({name: 'value', title: 'Valeur', type: 'string', validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'label', subtitle: 'value'}},
})

export const valueItem = defineType({
  name: 'valueItem',
  title: 'Valeur',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'title', subtitle: 'description'}},
})

