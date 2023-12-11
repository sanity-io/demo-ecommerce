import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

import {ShopifyProductTagList} from '../../../components/inputs/ShopifyProductTagList'

export default defineField({
  name: 'module.taggedProducts',
  title: 'Tagged Products',
  type: 'object',
  icon: TagIcon,
  fields: [
    // Modules (products)
    defineField({
      name: 'tag',
      title: 'Tag to show',
      type: 'string',
      components: {
        input: ShopifyProductTagList,
      },
    }),
    // Layout
    defineField({
      name: 'number',
      title: 'Number of products',
      type: 'number',
      initialValue: 2,
      validation: (rule) => rule.max(4).min(1).required(),
    }),
    // Layout
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'card',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: [
          {
            title: 'Cards (large)',
            value: 'card',
          },
          {
            title: 'Pills (small)',
            value: 'pill',
          },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      tag: 'tag',
      number: 'number',
    },
    prepare({tag, number}) {
      return {
        title: `${number} tagged products`,
        subtitle: tag ? `Tag: ${tag}` : 'No tag selected',
        media: TagIcon,
      }
    },
  },
})
