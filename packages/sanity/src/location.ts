import type {DocumentLocationResolver, DocumentLocationsState} from 'sanity/presentation'
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
        `*[_id == $id][0]{
          _type,
          "title": coalesce(title, hero.title, seo.title, "Untitled"),
          "slug": slug.current
        }`,
        {id},
        {perspective: 'previewDrafts'}
      )

      return document$.pipe(
        map((document) => {
          if (!document || !document.slug) {
            return null
          }

          const {_type, title, slug} = document
          // @ts-expect-error
          const firstSegment = firstSegmentBasedOnType[_type]

          return {
            locations: [
              {
                title,
                href: `/${firstSegment}/${slug}`,
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
          "slug": store.slug.current
        }`,
        {id},
        {perspective: 'previewDrafts'}
      )

      const document$ = documentStore.listenQuery(
        `*[_id == $id][0]{
          _type,
          language,
          "title": coalesce(seo.title, title, store.title, name, "No title"),
          "slug": coalesce(store.slug.current, slug.current, null)
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
                  if (!document) {
                    return null
                  }

                  const {_type, title, slug, language} = document
                  let hrefBase = `/`
                  // @ts-expect-error
                  const firstSegment = firstSegmentBasedOnType[_type]

                  if (_type === 'home') {
                    hrefBase = `/`
                  } else if (language) {
                    // @ts-expect-error
                    hrefBase = `/${localeByLanguage[language]}/`
                  }

                  return {title, href: `${hrefBase}${firstSegment}/${slug}`}
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
