import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'page', title: 'Page', default: true},
    {name: 'form', title: 'Formulaire'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'eyebrow', title: 'Surtitre', type: 'string', group: 'page'}),
    defineField({name: 'title', title: 'Titre', type: 'string', group: 'page', validation: (rule) => rule.required()}),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 3, group: 'page'}),

    defineField({
      name: 'formTitle',
      title: 'Titre du formulaire',
      type: 'string',
      group: 'form',
      description: 'N’indiquez un délai de rappel que s’il est réellement tenu.',
    }),
    defineField({
      name: 'formBackground',
      title: 'Photo d’arrière-plan',
      type: 'figure',
      group: 'form',
    }),
    defineField({
      name: 'timeframes',
      title: 'Options « Quand souhaitez-vous réaliser vos travaux ? »',
      type: 'array',
      group: 'form',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'renovationTypes',
      title: 'Types de rénovation',
      type: 'array',
      group: 'form',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'submitLabel', title: 'Libellé du bouton', type: 'string', group: 'form'}),
    defineField({name: 'consentText', title: 'Texte de consentement', type: 'text', rows: 3, group: 'form'}),
    defineField({name: 'successTitle', title: 'Titre de confirmation', type: 'string', group: 'form'}),
    defineField({name: 'successMessage', title: 'Message de confirmation', type: 'text', rows: 3, group: 'form'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Contact'})},
})
