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
      name: 'attributes',
      type: 'array',
      of: [
        {
          name: 'attribute',
          type: 'reference',
          to: [{type: 'materialAttribute'}],
        },
      ],
    }),
    defineField({
      name: 'story',
      type: 'simpleBlockContent',
    }),
  ],
});
