import {defineField} from 'sanity';

const {DocumentVideoIcon} = await import('@sanity/icons');

export default defineField({
  name: 'module.video',
  title: 'Video',
  type: 'object',
  icon: DocumentVideoIcon,
  preview: {select: {title: 'video.asset.playbackId'}},
  fields: [
    // Video
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      validation: (Rule) => Rule.required(),
    }),
  ],
});
