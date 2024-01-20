import {defineArrayMember, defineField} from 'sanity'

export default defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {
            title: 'Italic',
            value: 'em',
          },
          {
            title: 'Strong',
            value: 'strong',
          },
        ],
        annotations: [
          // product
          {
            name: 'annotationProduct',
            type: 'annotationProduct',
          },
          // Email
          {
            name: 'annotationLinkEmail',
            type: 'annotationLinkEmail',
          },
          // Internal link
          {
            name: 'annotationLinkInternal',
            type: 'annotationLinkInternal',
          },
          // URL
          {
            name: 'annotationLinkExternal',
            type: 'annotationLinkExternal',
          },
        ],
      },
      // Paragraphs
      type: 'block',
    }),
    // Custom blocks
    defineArrayMember({
      name: 'blockAccordion',
      type: 'module.accordion',
    }),
    defineArrayMember({
      name: 'blockCallout',
      type: 'module.callout',
    }),
    defineArrayMember({
      name: 'blockGrid',
      type: 'module.grid',
    }),
    defineArrayMember({
      name: 'blockImages',
      type: 'module.images',
    }),
    defineArrayMember({
      name: 'blockInstagram',
      type: 'module.instagram',
    }),
    defineArrayMember({
      name: 'blockProducts',
      type: 'module.products',
    }),
    defineArrayMember({
      name: 'blockTaggedProducts',
      type: 'module.taggedProducts',
    }),
  ],
})
