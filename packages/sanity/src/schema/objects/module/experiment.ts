import {RocketIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.experiment',
  title: 'Experiment',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Experiment name',
      description: 'Used to tell analytics which experiment was shown',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'a',
      title: 'Primary content',
      type: 'module.image',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'b',
      title: 'Test content',
      type: 'module.image',
    })
  ],
  // preview: {
  //   select: {
  //     url: 'url',
  //   },
  //   prepare(selection) {
  //     const {url} = selection
  //     return {
  //       subtitle: 'Experiment',
  //       title: url,
  //       media: RocketIcon,
  //     }
  //   },
  // },
})
