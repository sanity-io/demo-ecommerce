import {defineArrayMember, defineField} from 'sanity'

export default defineField({
  name: 'hero.home',
  title: 'Home hero',
  type: 'object',
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 3,
    }),
    // Link
    defineField({
      name: 'links',
      title: 'Link',
      type: 'array',
      of: [defineArrayMember({type: 'linkInternal'}), defineArrayMember({type: 'linkExternal'})],
      validation: (rule) => rule.max(1),
    }),
    // Content
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      validation: (rule) => rule.max(1),
      of: [
        defineArrayMember({
          name: 'productWithVariant',
          title: 'Product with variant',
          type: 'productWithVariant',
        }),
        defineArrayMember({
          name: 'imageWithProductHotspots',
          title: 'Image',
          type: 'imageWithProductHotspots',
        }),
      ],
    }),
  ],
})
