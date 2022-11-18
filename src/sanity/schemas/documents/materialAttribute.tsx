import {StackCompactIcon} from '@sanity/icons';
import {defineField} from 'sanity';

export default defineField({
  name: 'materialAttribute',
  title: 'Material Attributes',
  type: 'document',
  icon: StackCompactIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'vector',
      title: 'Vector icon',
      type: 'image',
      options: {
        accept: 'image/svg+xml',
      },
      validation: (Rule) =>
        Rule.custom((image) => {
          if (!image) {
            return true;
          }
          const pattern = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/;
          const format = image.asset._ref.match(pattern)[3];
          if (format !== 'svg') {
            return 'Image must be an SVG';
          }
          return true;
        }),
    }),
  ],
});
