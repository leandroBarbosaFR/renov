import {InboxIcon} from '@sanity/icons/Inbox'
import {defineField, defineType} from 'sanity'

/** Written by the website's contact form. Read-only except for the follow-up status. */
export const contactSubmission = defineType({
  name: 'contactSubmission',
  title: 'Demande de devis',
  type: 'document',
  icon: InboxIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Suivi',
      type: 'string',
      options: {
        list: [
          {title: 'Nouvelle', value: 'new'},
          {title: 'En cours', value: 'inProgress'},
          {title: 'Traitée', value: 'done'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'new',
    }),
    defineField({name: 'lastName', title: 'Nom', type: 'string', readOnly: true}),
    defineField({name: 'firstName', title: 'Prénom', type: 'string', readOnly: true}),
    defineField({name: 'email', title: 'Email', type: 'string', readOnly: true}),
    defineField({name: 'phone', title: 'Téléphone', type: 'string', readOnly: true}),
    defineField({name: 'address', title: 'Adresse du chantier', type: 'string', readOnly: true}),
    defineField({name: 'city', title: 'Ville', type: 'string', readOnly: true}),
    defineField({name: 'postalCode', title: 'Code postal', type: 'string', readOnly: true}),
    defineField({name: 'renovationType', title: 'Type de rénovation', type: 'string', readOnly: true}),
    defineField({name: 'timeframe', title: 'Délai souhaité', type: 'string', readOnly: true}),
    defineField({name: 'message', title: 'Descriptif des travaux', type: 'text', rows: 8, readOnly: true}),
    defineField({name: 'sourcePage', title: 'Page d’origine', type: 'string', readOnly: true}),
    defineField({name: 'submittedAt', title: 'Reçue le', type: 'datetime', readOnly: true}),
  ],
  orderings: [{title: 'Plus récentes', name: 'submittedDesc', by: [{field: 'submittedAt', direction: 'desc'}]}],
  preview: {
    select: {lastName: 'lastName', firstName: 'firstName', city: 'city', status: 'status', date: 'submittedAt'},
    prepare: ({lastName, firstName, city, status, date}) => ({
      title: [firstName, lastName].filter(Boolean).join(' ') || 'Demande',
      subtitle: [
        status === 'done' ? 'Traitée' : status === 'inProgress' ? 'En cours' : 'Nouvelle',
        city,
        date ? new Date(date).toLocaleDateString('fr-FR') : null,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
