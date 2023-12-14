import type {ResolveProductionUrlContext, SanityDocumentLike, Slug} from 'sanity'

import {ENVIRONMENT, LANGUAGES} from '../constants'

type store = {
  slug: Slug
}

export default async function resolveProductionUrl(
  _: string | undefined,
  context: ResolveProductionUrlContext
) {
  const {document} = context

  return resolvePreviewUrl(document)
}

export const resolvePreviewUrl = (document: SanityDocumentLike) => {
  const {domain, secret} = window[ENVIRONMENT].preview
  const previewUrl = new URL('/api/preview', domain ?? 'http://localhost:3000')

  previewUrl.searchParams.append(`secret`, secret)

  let path = '/'

  switch (document?._type) {
    case 'page': {
      const slug = (document?.slug as Slug)?.current
      path = slug == null ? '/' : `/pages/${slug}`
      break
    }

    case 'product': {
      const slug = (document?.store as store)?.slug?.current
      path = slug == null ? '/' : `/products/${slug}`
      break
    }

    case 'guide': {
      const slug = (document?.slug as Slug)?.current
      path = slug == null ? '/' : `/guides/${slug}`
      break
    }

    case 'article': {
      const slug = (document?.slug as Slug)?.current
      path = slug == null ? '/' : `/articles/${slug}`
      break
    }

    case 'landingPage': {
      const slug = (document?.slug as Slug)?.current
      path = slug == null ? '/' : `/landingPages/${slug}`
      break
    }

    case 'collection': {
      const slug = (document?.store as store)?.slug?.current
      path = slug == null ? '/' : `/collections/${slug}`
      break
    }

    case 'person': {
      const slug = (document?.slug as Slug)?.current
      path = slug == null ? '/' : `/people/${slug}`
      break
    }
  }

  if (document?.language) {
    const language = LANGUAGES.find(({id}) => id === document.language)

    if (language?.previewUrl) {
      path = `/${language.previewUrl}${path}`
    }
  }

  previewUrl.searchParams.append('slug', path)

  return previewUrl.toString()
}
