import {EarthGlobeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import page from './page'

export default defineType({
  ...page,
  name: 'guide',
  title: 'Guide',
  icon: EarthGlobeIcon,
  fields: [
    ...page.fields,
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
    },
    prepare(props) {
      const {title, language} = props

      return {
        title,
        subtitle: language.toUpperCase(),
      }
    },
  },
})
