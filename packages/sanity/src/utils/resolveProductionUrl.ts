import type {ResolveProductionUrlContext, SanityDocumentLike, Slug} from 'sanity'
import {ENVIRONMENT} from '../constants'

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

  if (document?._type === 'page') {
    const slug = (document?.slug as Slug)?.current
    const path = slug == null ? '/' : `/pages/${slug}`

    previewUrl.searchParams.append('slug', path)

    return previewUrl.toString()
  }

  if (document?._type === 'product') {
    const slug = (document?.store as store)?.slug?.current
    const path = slug == null ? '/' : `/products/${slug}`

    previewUrl.searchParams.append('slug', path)

    return previewUrl.toString()
  }

  return ''
}
