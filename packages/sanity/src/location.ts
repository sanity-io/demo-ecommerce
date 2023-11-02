import type {DocumentLocationResolver} from '@sanity/presentation'

export const locate: DocumentLocationResolver = (params, context) => {
  console.log({params, context})

  return null
}
