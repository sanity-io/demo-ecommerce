import {ComponentIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'material',
  title: 'Materials',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      validation: (rule) => rule.required(),
      options: {
        source: 'name[0].value',
      },
    }),
    defineField({
      name: 'story',
      type: 'internationalizedArraySimpleBlockContent',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      description: 'Shown on products using this material',
      type: 'internationalizedArrayFaqs',
    }),
    defineField({
      name: 'attributes',
      type: 'object',
      fields: [
        defineField({
          name: 'environmentallyFriendly',
          type: 'boolean',
        }),
        defineField({
          name: 'dishwasherSafe',
          type: 'boolean',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
    prepare({title}) {
      return {
        title: title?.[0]?.value,
      }
    },
  },
})
