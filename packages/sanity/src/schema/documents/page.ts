import {DocumentIcon} from '@sanity/icons'
import {defineField} from 'sanity'

import {isUniqueOtherThanLanguage, validateSlug} from '../../utils/validateSlug'

export default defineField({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
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
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    // Slug
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', isUnique: isUniqueOtherThanLanguage},
      // @ts-expect-error - TODO - fix this TS error
      validation: validateSlug,
    }),
    // Color theme
    defineField({
      name: 'colorTheme',
      title: 'Color theme',
      type: 'reference',
      to: [{type: 'colorTheme'}],
      group: 'theme',
    }),
    // Show hero
    defineField({
      name: 'showHero',
      title: 'Show hero',
      type: 'boolean',
      description: 'If disabled, page title will be displayed instead',
      initialValue: false,
      group: 'editorial',
    }),
    // Hero
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'hero.page',
      hidden: ({document}) => !document?.showHero,
      group: 'editorial',
    }),
    // Body
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
      group: 'editorial',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
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
      active: 'active',
      seoImage: 'seo.image',
      title: 'title',
      language: 'language',
    },
    prepare(selection) {
      const {seoImage, title, language} = selection

      return {
        media: seoImage,
        title,
        subtitle: language?.toUpperCase(),
      }
    },
  },
})
