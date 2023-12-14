import {BookIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import TranslatedDoc from '../components/media/TranslatedDoc'
import {LANGUAGES, SANITY_API_VERSION} from '../constants'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Articles')
    .icon(BookIcon)
    .schemaType('article')
    .child(
      S.list()
        .title('Articles')
        .items([
          ...LANGUAGES.map((language) =>
            S.listItem()
              .title(`Articles (${language.id.toLocaleUpperCase()})`)
              .schemaType('article')
              .icon(() => <TranslatedDoc icon={<BookIcon />} languageIcon={language.icon} />)
              .child(
                S.documentList()
                  .id(language.id)
                  .title(`${language.title} Articles`)
                  .schemaType('article')
                  .apiVersion(SANITY_API_VERSION)
                  .filter('_type == "article" && language == $language')
                  .params({language: language.id})
                  .initialValueTemplates([
                    S.initialValueTemplateItem('article-language', {
                      id: 'article-language',
                      language: language.id,
                    }),
                  ])
                  .canHandleIntent((intentName, params) => {
                    if (intentName === 'edit') {
                      return false
                    }

                    if (!params.template) {
                      return true
                    }

                    const languageValue = params?.template?.split(`-`).pop()
                    return languageValue === language.id
                  })
              )
          ),
          S.divider(),
          S.listItem()
            .title(`All Articles`)
            .schemaType('article')
            .icon(BookIcon)
            .child(
              S.documentList()
                .id(`all-articles`)
                .title(`All Articles`)
                .schemaType('article')
                .apiVersion(SANITY_API_VERSION)
                .filter('_type == "article"')
                .canHandleIntent(
                  (intentName, params) => intentName === 'edit' || params.template === `article`
                )
            ),
        ])
    )
)
