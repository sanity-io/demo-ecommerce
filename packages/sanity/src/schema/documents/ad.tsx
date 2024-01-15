import {defineType} from 'sanity'

export const ad = defineType({
  name: 'ad',
  type: 'document',
  title: 'Ad',
  preview: {
    select: {
      title: 'title',
      subtitle: 'channel',
      media: 'product.store.previewImageUrl',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle,
        media: () => media && <img src={media} alt={title} />,
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'channel',
      type: 'string',
      options: {
        list: ['instagram', 'google', 'pinterest'],
      },
    },
    {
      name: 'product',
      type: 'reference',
      to: [{type: 'product'}],
    },
    {
      name: 'copy',
      type: 'text',
      title: 'Ad copy',
      description: 'The text that will be used in the ad',
    },
    {
      name: 'startDate',
      type: 'date',
      title: 'Start date',
      description: 'When the ad should start',
    },
    {
      name: 'endDate',
      type: 'date',
      title: 'End date',
      description: 'When the ad should end',
    },
  ],
})
