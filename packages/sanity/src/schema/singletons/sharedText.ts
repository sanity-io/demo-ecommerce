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
      title: 'Delivery and Returns Information',
      type: 'internationalizedArraySimpleBlockContent',
      description:
        'Enter information about delivery and return policies. This content can be displayed across various parts of the site.',
    }),
    // Labels
    defineField({
      name: 'labels',
      title: 'Labels',
      type: 'array',
      description:
        'Define micro copy and text strings used throughout the e-commerce experience. Collaborate with a developer to add new ones, and be careful with deleting entries.',
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
