import {HomeIcon} from '@sanity/icons'
import {defineField} from 'sanity'

const TITLE = 'Home'

export default defineField({
  name: 'home',
  title: TITLE,
  type: 'document',
  icon: HomeIcon,
  groups: [
    {
      name: 'theme',
      title: 'Theme',
    },
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
        // Color theme
        defineField({
          name: 'colorTheme',
          title: 'Color theme',
          type: 'reference',
          to: [{type: 'colorTheme'}],
          group: 'theme',
        }),
    // Hero
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'hero.home',
      group: 'editorial',
    }),
    // Modules
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        {type: 'module.callout'},
        {type: 'module.callToAction'},
        {type: 'module.collection'},
        {type: 'module.image'},
        {type: 'module.instagram'},
        {type: 'module.product'},
        {type: 'module.experiment'}
      ],
      group: 'editorial',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.home',
      group: 'seo',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare({language}) {
      return {
        // media: icon,
        title: TITLE,
        subtitle: language.toUpperCase(),
      }
    },
  },
})
