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
    case 'product':
    case 'person': {
      const incomingReferences$ = documentStore.listenQuery(
        `*[references($id) && (defined(slug) || defined(store.slug))]`,
        {id},
        {perspective: 'previewDrafts'}
      )

      const document$ = documentStore.listenQuery(
        `*[_id == $id][0]`,
        {id},
        {perspective: 'previewDrafts'}
      )

      return incomingReferences$.pipe(
        switchScan((acc, incomingReferences) => {
          return acc.pipe(
            map((document) => ({
              locations: [document, ...incomingReferences]
                .map((document: any) => {
                  const title =
                    document.seo?.title ||
                    document?.title ||
                    document?.store?.title ||
                    document?.name ||
                    'No title'
                  const href = `${
                    'language' in document
                      ? // @ts-expect-error
                        localeByLanguage[document.language]
                      : document._type === 'home'
                      ? ''
                      : '/'
                  }${
                    // @ts-expect-error
                    firstSegmentBasedOnType[document._type]
                  }/${document?.slug?.current || document.store?.slug?.current || ''}`

                  return {
                    title,
                    href,
                  }
                })
                .filter(({href, title}: any) => href && title),
            }))
          )
        }, document$)
      )
    }

    case 'material': {
      const incomingReferences$ = documentStore.listenQuery(
        `*[references($id) && (defined(slug) || defined(store.slug))]`,
        {id},
        {perspective: 'previewDrafts'}
      )

      return incomingReferences$.pipe(
        map((documents) => ({
          locations: [...documents]
            .map((document: any) => {
              console.log(document)

              const title =
                document.seo?.title ||
                document?.title ||
                document?.store?.title ||
                document?.name ||
                'No title'
              const href = `${
                'language' in document
                  ? // @ts-expect-error
                    localeByLanguage[document.language]
                  : document._type === 'home'
                  ? ''
                  : '/'
              }${
                // @ts-expect-error
                firstSegmentBasedOnType[document._type]
              }/${document?.slug?.current || document.store?.slug?.current || ''}`

              return {
                title,
                href,
              }
            })
            .filter(({href, title}: any) => href && title),
        }))
      )
    }

    default:
      return null
  }
}
