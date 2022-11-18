import {UsersIcon} from '@sanity/icons';
import {defineField} from 'sanity';

export default defineField({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'bio',
      type: 'simpleBlockContent',
    }),
  ],
});
