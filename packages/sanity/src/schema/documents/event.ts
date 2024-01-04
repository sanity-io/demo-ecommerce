import {CalendarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const event = defineType({
  type: 'document',
  name: 'event',
  title: 'Event',
  icon: CalendarIcon,
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'image',
    },
  },
  groups: [
    {
      name: 'theme',
      title: 'Theme',
    },
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Event Title',
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      title: 'Event Slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      type: 'text',
      name: 'description',
      title: 'Event Description',
    }),
    defineField({
      type: 'date',
      name: 'date',
      title: 'Event Date',
    }),
    defineField({
      type: 'number',
      name: 'duration',
      title: 'Event Duration',
      description: 'How long will the event be (in minutes)',
      validation: (rule) => [
        rule.required(),
        rule.greaterThan(0).error('Duration has to be above 0'),
      ],
    }),
    defineField({
      type: 'geopoint',
      name: 'location',
      title: 'Event Location',
    }),
    defineField({
      type: 'image',
      name: 'image',
      title: 'Event Image',
      options: {
        captionField: 'alt',
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO',
        },
      ],
    }),
    defineField({
      type: 'number',
      name: 'capacity',
      title: 'Event Capacity',
      description: 'No value or 0 is unlimited',
    }),
    defineField({
      type: 'number',
      name: 'price',
      title: 'Event Price ($)',
      description: `No value or 0 means it's free`,
    }),
    defineField({
      name: 'colorTheme',
      title: 'Color theme',
      type: 'reference',
      to: [{type: 'colorTheme'}],
      group: 'theme',
    }),
  ],
})
