import {ImageIcon} from '@sanity/icons/Image'
import {ImagesIcon} from '@sanity/icons/Images'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'

export const galleryFull = defineType({
  name: 'galleryFull',
  title: 'Image pleine largeur',
  type: 'object',
  icon: ImageIcon,
  fields: [defineField({name: 'image', title: 'Image', type: 'figure', validation: (rule) => rule.required()})],
  preview: {
    select: {media: 'image', alt: 'image.alt'},
    prepare: ({media, alt}) => ({title: alt || 'Image pleine largeur', subtitle: 'Pleine largeur', media}),
  },
})

export const galleryPair = defineType({
  name: 'galleryPair',
  title: 'Deux images (50/50)',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({name: 'left', title: 'Image de gauche', type: 'figure', validation: (rule) => rule.required()}),
    defineField({name: 'right', title: 'Image de droite', type: 'figure', validation: (rule) => rule.required()}),
  ],
  preview: {
    select: {media: 'left', alt: 'left.alt'},
    prepare: ({media, alt}) => ({title: alt || 'Deux images', subtitle: 'Deux colonnes', media}),
  },
})

export const galleryText = defineType({
  name: 'galleryText',
  title: 'Image et texte',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'image', title: 'Image', type: 'figure', validation: (rule) => rule.required()}),
    defineField({name: 'title', title: 'Titre', type: 'string'}),
    defineField({name: 'text', title: 'Texte', type: 'text', rows: 5, validation: (rule) => rule.required()}),
    defineField({
      name: 'imagePosition',
      title: 'Position de l’image',
      type: 'string',
      options: {
        list: [
          {title: 'Gauche', value: 'left'},
          {title: 'Droite', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {media: 'image', title: 'title', text: 'text'},
    prepare: ({media, title, text}) => ({title: title || text || 'Image et texte', subtitle: 'Image + texte', media}),
  },
})
