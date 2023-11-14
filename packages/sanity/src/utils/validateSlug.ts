import {getIdPair, Rule, Slug, type SlugValidationContext} from 'sanity'
import slug from 'slug'

const MAX_LENGTH = 96

export const validateSlug = (Rule: Rule) => {
  return Rule.required().custom(async (value: Slug) => {
    const currentSlug = value && value.current
    if (!currentSlug) {
      return true
    }

    if (currentSlug.length >= MAX_LENGTH) {
      return `Must be less than ${MAX_LENGTH} characters`
    }

    if (currentSlug !== slug(currentSlug, {lower: true})) {
      return 'Must be a valid slug'
    }
    return true
  })
}

export async function isUniqueOtherThanLanguage(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context
  if (!document?.language) {
    return true
  }
  const client = getClient({apiVersion: '2023-04-24'})
  const {draftId, publishedId} = getIdPair(document._id)
  const params = {
    draft: draftId,
    published: publishedId,
    language: document.language,
    slug,
  }
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`
  const result = await client.fetch(query, params)
  return result
}
