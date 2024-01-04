import {defineField} from 'sanity'

export default defineField({
  name: 'hero.collection',
  title: 'Collection Hero',
  type: 'object',
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 3,
      description:
        'The main title for the hero section. This should be eye-catching and relevant to the content of the collection.',
    }),
    // Description
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        'A brief description or summary that provides context or additional information about the collection.',
    }),
    // Content
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description:
        'The content elements within the hero section. You can include products with variants or images with product hotspots.',
      validation: (rule) => rule.max(1),
      of: [
        {
          name: 'productWithVariant',
          title: 'Product with Variant',
          type: 'productWithVariant',
          description:
            'A product item with variants, such as different sizes or colors, to be featured in the hero section.',
        },
        {
          name: 'imageWithProductHotspots',
          title: 'Image with Product Hotspots',
          type: 'imageWithProductHotspots',
          description:
            'An image that includes interactive hotspots to highlight products or features.',
        },
      ],
    }),
  ],
})
