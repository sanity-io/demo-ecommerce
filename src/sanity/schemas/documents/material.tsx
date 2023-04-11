// @ts-expect-error incompatibility with node16 resolution
import {ComponentIcon} from '@sanity/icons';
import {defineField} from 'sanity';

export default defineField({
  name: 'material',
  title: 'Materials',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'story',
      type: 'simpleBlockContent',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      description: 'Shown on products using this material',
      type: 'faqs',
    }),
    defineField({
      name: 'attributes',
      type: 'object',
      fields: [
        defineField({
          name: 'environmentallyFriendly',
          type: 'boolean',
        }),
        defineField({
          name: 'dishwasherSafe',
          type: 'boolean',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
  ],
});
