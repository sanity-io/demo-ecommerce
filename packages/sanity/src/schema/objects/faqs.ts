import {StackCompactIcon} from '@sanity/icons'
import {defineField} from 'sanity'

import blocksToText from '../../utils/blocksToText'

export default defineField({
  name: 'faqs',
  title: 'FAQs',
  type: 'array',
  icon: StackCompactIcon,
  of: [
    {
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      icon: false,
      fields: [
        defineField({
          name: 'question',
          title: 'Question',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'answer',
          title: 'Answer',
          type: 'simpleBlockContent',
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {
          body: 'answer',
          title: 'question',
        },
        prepare(selection) {
          const {title, body} = selection
          return {
            subtitle: body && blocksToText(body),
            title,
          }
        },
      },
    },
  ],
})
