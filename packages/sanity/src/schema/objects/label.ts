import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  icon: TagIcon,
  name: 'label',
  title: 'Label',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: `This will be used to identify the label in the code. It should be unique and contain only lowercase letters and periods`,
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      subtitle: 'key',
    },
    prepare(selection) {
      const {text, subtitle} = selection

      const title =
        text && Object.keys(text).filter((key) => key !== '_type').length
          ? Object.keys(text)
              .filter((key) => key !== '_type')
              .map((lang) => text[lang].value)
              .join(', ')
          : `[No translated text strings]`

      return {
        title,
        subtitle,
      }
    },
  },
})
