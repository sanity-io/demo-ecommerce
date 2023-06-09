import {defineField} from 'sanity'

export default defineField({
  type: 'object',
  name: 'creator',
  title: 'Creator',
  fields: [
    defineField({
      name: 'person',
      type: 'reference',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'role',
      type: 'string',
      options: {
        list: ['designer', 'artisan', 'supplier', 'ceramist'],
      },
    }),
  ],
  preview: {
    select: {
      title: 'person.name',
      subtitle: 'role',
      media: 'person.image',
    },
  },
})
