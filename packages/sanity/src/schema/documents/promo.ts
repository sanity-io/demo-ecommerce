import {SparkleIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'promo',
  title: 'Promo',
  type: 'document',
  icon: SparkleIcon,
  groups: [
    
  ],
  fields: [
    // Name
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    // // Slug
    // defineField({
    //   name: 'slug',
    //   type: 'slug',
    //   options: {source: 'name'},
    //   group: 'editorial',
    //   validation: (Rule) => Rule.required(),
    // }),
    // Image
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'internationalizedArraySimpleBlockContent',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArraySimpleBlockContent',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.max(20),
    }),
    // Link
    defineField({
      name: 'links',
      title: 'Link',
      type: 'array',
      of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
      validation: (Rule) => Rule.max(1),
    }),
  ],
})
