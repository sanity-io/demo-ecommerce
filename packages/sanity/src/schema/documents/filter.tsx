import {FilterIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'filter',
  title: 'Filter',
  type: 'document',
  icon: FilterIcon,
  fields: [
    defineField({
      name: 'colorTheme',
      type: 'reference',
      to: [{type: 'colorTheme'}],
    }),
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      description: `Catch the reader's eye. Use less than 5 words.`,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description: 'A short description that represents this combination',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'material',
      type: 'reference',
      to: [{type: 'material'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'person',
      type: 'reference',
      to: [{type: 'person'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title?.[0]?.value,
      }
    },
  },
})
