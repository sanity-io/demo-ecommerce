import type {DocumentLocationResolver} from '@sanity/composer'

export const locate: DocumentLocationResolver = (params, context) => {
  console.log({params, context})

  return null
}
