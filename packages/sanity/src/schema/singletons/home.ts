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
      default: true,
      name: 'editorial',
      title: 'Editorial',
      description: 'Content and layout settings for the home page.',
    },
    {
      name: 'seo',
      title: 'SEO',
      description: 'Search engine optimization settings for the home page.',
    },
  ],
  fields: [
    // Hero
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'hero.home',
      description:
        'The hero section of the home page, which is the first visual element visitors will see.',
      group: 'editorial',
    }),
    // Modules
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      description:
        'Different content modules that can be added to the home page, such as callouts, call to action, collections, images, Instagram feeds, or product features.',
      of: [
        {type: 'module.callout'},
        {type: 'module.callToAction'},
        {type: 'module.collection'},
        {type: 'module.image'},
        {type: 'module.instagram'},
        {type: 'module.product'},
      ],
      group: 'editorial',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.home',
      description:
        'SEO-related settings for the home page, including metadata like titles and descriptions that improve search engine visibility.',
      group: 'seo',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description:
        'The language setting of the home page, mainly used for sites supporting multiple languages.',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare({language}) {
      return {
        title: TITLE,
        subtitle: language.toUpperCase(),
      }
    },
  },
})
