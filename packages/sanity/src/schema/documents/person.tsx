import {UsersIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UsersIcon,
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
    // Name
    defineField({
      name: 'name',
      type: 'string',
      group: 'editorial',
    }),
    // Slug
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      group: 'editorial',
      validation: (Rule) => Rule.required(),
    }),
    // Image
    defineField({
      name: 'image',
      type: 'image',
      group: 'editorial',
    }),
    // Biography
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'internationalizedArraySimpleBlockContent',
      group: 'editorial',
    }),
    // LinkedIn Link
    defineField({
      name: 'linkedIn',
      title: 'LinkedIn Profile',
      type: 'array',
      of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
      validation: (Rule) => Rule.max(1),
      group: 'editorial',
    }),
    // TikTok Link
    defineField({
      name: 'tiktoc',
      title: 'TicTok Profile',
      type: 'array',
      of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
      validation: (Rule) => Rule.max(1),
      group: 'editorial',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
  ],
})
