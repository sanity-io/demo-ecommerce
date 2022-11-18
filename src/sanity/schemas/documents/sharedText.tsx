import {DocumentTextIcon} from '@sanity/icons';

export default {
  name: 'sharedText',
  title: 'Shared Text',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'simpleBlockContent',
    },
  ],
};
