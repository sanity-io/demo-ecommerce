import {defineField} from 'sanity'

export default defineField({
  name: 'hero.home',
  title: 'Home Hero',
  type: 'object',
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 3,
      description:
        'The headline for the home hero section. This should be compelling and set the tone for the home page.',
    }),
    // Link
    defineField({
      name: 'links',
      title: 'Link',
      type: 'array',
      description:
        'Links for navigation or call-to-action. You can include internal or external links. Limited to one for focused user guidance.',
      of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
      validation: (rule) => rule.max(1),
    }),
    // Content
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description:
        'Content elements within the hero section, such as featured products or engaging images with product hotspots.',
      validation: (rule) => rule.max(1),
      of: [
        {
          name: 'productWithVariant',
          title: 'Product with Variant',
          type: 'productWithVariant',
          description:
            'A featured product with options for different variants, such as size or color, to be displayed in the hero section.',
        },
        {
          name: 'imageWithProductHotspots',
          title: 'Image',
          type: 'imageWithProductHotspots',
          description:
            'An interactive image with hotspots to highlight products or features, enhancing engagement on the home page.',
        },
      ],
    }),
  ],
})
