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
    }),
    defineField({
      name: 'story',
      type: 'simpleBlockContent',
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
