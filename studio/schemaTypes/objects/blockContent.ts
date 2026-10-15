import {defineArrayMember, defineType} from 'sanity'

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Texte riche',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraphe', value: 'normal'},
        {title: 'Titre 2', value: 'h2'},
        {title: 'Titre 3', value: 'h3'},
        {title: 'Citation', value: 'blockquote'},
      ],
      lists: [
        {title: 'Liste à puces', value: 'bullet'},
        {title: 'Liste numérotée', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Gras', value: 'strong'},
          {title: 'Italique', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            title: 'Lien',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'string',
                validation: (rule) => rule.required(),
              },
            ],
          },
        ],
      },
    }),
  ],
})
