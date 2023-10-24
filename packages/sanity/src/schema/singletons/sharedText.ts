import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const TITLE = 'Shared Text'

export default defineType({
  name: 'sharedText',
  title: TITLE,
  type: 'document',
  icon: TagIcon,
  fields: [
    // Shared text
    defineField({
      name: 'deliveryAndReturns',
      type: 'internationalizedArraySimpleBlockContent',
    }),
    // Labels
    defineField({
      name: 'labels',
      title: 'Labels',
      type: 'array',
      of: [{type: 'label'}],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      }
    },
  },
})
