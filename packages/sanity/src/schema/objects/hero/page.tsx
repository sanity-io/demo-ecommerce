import {defineField} from 'sanity'

export default defineField({
  name: 'hero.page',
  title: 'Page Hero',
  type: 'object',
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 3,
      description:
        'The main title for the page hero section. This should be engaging and relevant to the content of the page.',
    }),
    // Content
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description:
        'The content elements within the hero section. You can choose to feature a product with variants or an image with product hotspots.',
      validation: (rule) => rule.max(1),
      of: [
        {
          name: 'productWithVariant',
          title: 'Product with Variant',
          type: 'productWithVariant',
          description:
            'A product item with options for different variants, such as sizes or colors, which can be featured prominently in the hero section.',
        },
        {
          name: 'imageWithProductHotspots',
          title: 'Image',
          type: 'imageWithProductHotspots',
          description:
            'An interactive image that includes hotspots to highlight products or features, offering a dynamic visual experience.',
        },
      ],
    }),
  ],
})
