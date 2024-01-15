import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField} from 'sanity'

import {isUniqueOtherThanLanguage, validateSlug} from '../../utils/validateSlug'

export default defineField({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      // description: 'Customize the visual theme and style of the page here.',
      name: 'theme',
      title: 'Theme',
    },
    {
      default: true,
      // description: 'Core content and layout settings for the page.',
      name: 'editorial',
      title: 'Editorial',
    },
    {
      // description: 'Settings and content enhancements for search engine optimization.',
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
      group: ['editorial', 'seo'],
      description: 'The primary title of the page, used as the main heading.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'altTitles',
      title: 'Alternative titles',
      type: 'array',
      group: ['editorial', 'seo'],
      description: 'Provide alternative titles for A/B/N testing',
      of: [
        {
          type: 'object',
          name: 'variation',
          title: 'Title variation',
          preview: {
            select: {
              title: 'title',
              subtitle: 'weigth',
            },
          },
          fields: [
            {
              name: 'title',
              type: 'string',
            },
            defineField({
              name: 'weight',
              type: 'number',
              description: 'Will be equal for all variations if not set',
              validation: (rule) => [
                rule.lessThan(100).error(`Weight can't be above 100.`),
                rule.greaterThan(0).error(`Weight have to be above zero.`),
              ],
            }),
          ],
        },
      ],
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
    defineField({
      name: 'related',
      title: 'Related content',
      description: 'Drive readers to this related content.',
      type: 'array',
      group: ['seo', 'editorial'],
      validation: (rule) => rule.unique(),
      of: [
        defineArrayMember({
          name: 'cta',
          title: 'Related content call to action',
          type: 'object',
          fields: [
            {
              name: 'text',
              type: 'string',
              title: 'Custom call to action',
            },
            {
              name: 'article',
              type: 'reference',
              to: [{type: 'page'}, {type: 'guide'}],
            },
          ],
        }),
      ],
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
