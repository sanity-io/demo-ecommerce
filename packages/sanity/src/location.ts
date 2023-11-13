import type {DocumentLocationResolver, DocumentLocationsState} from '@sanity/presentation'
import {map} from 'rxjs'

const firstSegmentBasedOnType = {
  collection: '/collections/',
  guide: '/guides/',
  home: '/',
  page: '/pages/',
  product: '/products/',
  person: '/people/',
}

export const locate: DocumentLocationResolver = (params, context) => {
  //console.log({params, context})
  const {type, id} = params
  const {documentStore} = context
  if (type == 'home') {
    const doc$ = documentStore.listenQuery(`*[_id == $id]`, {id}, {perspective: 'previewDrafts'})

    return doc$.pipe(
      map((doc) => {
        // @todo: Make this dynamic using the same language logic as the storefront router
        const href = id == 'home-en' ? '/' : `/no-no`
        return {
          locations: [
            {
              title: doc.seo?.title || 'Home',
              href,
            },
          ],
        } satisfies DocumentLocationsState
      }),
    )
  }
  if (type == 'page') {
    const doc$ = documentStore.listenQuery(
      `*[_id == $id || _id == "drafts." + $id][0]`,
      {id},
      {perspective: 'previewDrafts'},
    )

    return doc$.pipe(
      map((doc) => {
        // @todo: Make this dynamic using the same language logic as the storefront router
        const href = doc?.slug.current
        return {
          locations: [
            {
              title: doc?.title || doc?.hero?.title || doc.seo?.title,
              href,
            },
          ],
        } satisfies DocumentLocationsState
      }),
    )
  }

  if (type == 'product' || type == 'person') {
    const docs$ = documentStore.listenQuery(
      `*[references($id)]`,
      {id},
      {perspective: 'previewDrafts'},
    )

    return docs$.pipe(
      map((docs) => {
        return {
          locations: docs
            .map((doc: any) => {
              const title =
                doc.seo?.title || doc?.title || doc?.store?.title || doc?.name || 'No title'
              // @ts-expect-error
              const href = `${firstSegmentBasedOnType[doc._type]}${
                doc?.slug?.current || doc.store?.slug?.current || ''
              }`

              return {
                title,
                href,
              }
            })
            .filter(({href, title}: any) => href && title),
        } satisfies DocumentLocationsState
      }),
    )
  }

  return null
}
