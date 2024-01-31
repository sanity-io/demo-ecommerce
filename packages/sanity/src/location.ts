import type {DocumentLocationResolver, DocumentLocationsState} from '@sanity/presentation'
import {map, switchScan} from 'rxjs'

const localeByLanguage = {
  en: '/',
  no: '/no-no/',
}

const firstSegmentBasedOnType = {
  collection: 'collections',
  guide: 'guides',
  home: '',
  page: 'pages',
  product: 'products',
  person: 'people',
  article: 'articles',
  event: 'events',
}

// TODO: needs to get cleaned up a bit
export const locate: DocumentLocationResolver = (params, context) => {
  const {type, id} = params
  const {documentStore} = context

  switch (type) {
    case 'home': {
      const document$ = documentStore.listenQuery(
        `*[_id == $id][0]`,
        {id},
        {perspective: 'previewDrafts'}
      )

      return document$.pipe(
        map((document) => {
          // @ts-expect-error
          const href = localeByLanguage[document.language]

          return {
            locations: [
              {
                title: document.seo?.title || 'Home',
                href,
              },
            ],
          } satisfies DocumentLocationsState
        })
      )
    }

    case 'article':
    case 'guide':
    case 'page': {
      const document$ = documentStore.listenQuery(
        `*[_id == $id][0]`,
        {id},
        {perspective: 'previewDrafts'}
      )

      return document$.pipe(
        map((document) => {
          // @ts-expect-error
          const href = `${localeByLanguage[document.language]}${
            // @ts-expect-error
            firstSegmentBasedOnType[document._type]
          }/${document?.slug?.current || ''}`

          return {
            locations: [
              {
                title: document?.title || document?.hero?.title || document.seo?.title,
                href,
              },
            ],
          } satisfies DocumentLocationsState
        })
      )
    }

    case 'collection':
    case 'event': {
      const document$ = documentStore.listenQuery(
        `*[_id == $id][0]`,
        {id},
        {perspective: 'previewDrafts'}
      )

      return document$.pipe(
        map((document) => {
          // @ts-expect-error
          const href = `${firstSegmentBasedOnType[document._type]}/${document?.slug?.current || ''}`

          return {
            locations: [
              {
                title: document?.title || document?.hero?.title || document.seo?.title,
                href,
              },
            ],
          } satisfies DocumentLocationsState
        })
      )
    }
    case 'product':
    case 'person': {
      const incomingReferences$ = documentStore.listenQuery(
        `*[
          references($id) 
          && _type == "product" 
          && defined(store.slug.current)
        ]{
          _type,
          "title": store.title,
          "href": store.slug.current
        }`,
        {id},
        {perspective: 'previewDrafts'}
      )

      const document$ = documentStore.listenQuery(
        `*[_id == $id][0]{
          _type,
          language,
          "title": coalesce(seo.title, title, store.title, name, "No title"),
          "href": coalesce(store.slug.current, slug.current, null)
        }`,
        {id},
        {perspective: 'previewDrafts'}
      )

      return incomingReferences$.pipe(
        switchScan((acc, incomingReferences) => {
          return acc.pipe(
            map((document) => ({
              locations: [document, ...incomingReferences]
                .map((document: any) => {
                  const {title} = document
                  let hrefBase = `/`
                  // @ts-expect-error
                  const firstSegment = firstSegmentBasedOnType[document._type]

                  if (document._type === 'home') {
                    hrefBase = `/`
                  } else if (document.language) {
                    // @ts-expect-error
                    hrefBase = `/${localeByLanguage[document.language]}`
                  }

                  return {title, href: `${hrefBase}${firstSegment}/${document.href}`}
                })
                .filter(({href, title}: any) => href && title),
            }))
          )
        }, document$)
      )
    }
    default:
      return null
  }
}
