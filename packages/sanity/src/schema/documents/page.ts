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
      description: 'Customize the visual theme and style of the page here.',
    },
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
      description: 'Core content and layout settings for the page.',
    },
    {
      name: 'seo',
      title: 'SEO',
      description: 'Settings and content enhancements for search engine optimization.',
    },
  ],
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The primary title of the page, used as the main heading.',
      validation: (rule) => rule.required(),
    }),
    // Slug
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The URL-friendly identifier for the page, derived from the title.',
      options: {source: 'title', isUnique: isUniqueOtherThanLanguage},
      validation: validateSlug,
    }),
    // Color Theme
    defineField({
      name: 'colorTheme',
      title: 'Color Theme',
      type: 'reference',
      description: 'Select a color theme to apply to the page for consistent branding.',
      to: [{type: 'colorTheme'}],
      group: 'theme',
    }),
    // Show Hero
    defineField({
      name: 'showHero',
      title: 'Show Hero',
      type: 'boolean',
      description: 'Toggle whether to display a hero section at the top of the page.',
      initialValue: false,
      group: 'editorial',
    }),
    // Hero
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'hero.page',
      description: 'Define the hero section content, visible only if the hero section is enabled.',
      hidden: ({document}) => !document?.showHero,
      group: 'editorial',
    }),
    // Body
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
      description: 'The main content area of the page, supports rich text and media elements.',
      group: 'editorial',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      description: 'Configure SEO-related aspects such as meta tags and descriptions.',
      group: 'seo',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'The language setting for the page, used for multilingual support.',
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
