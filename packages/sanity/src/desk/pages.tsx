import {DocumentsIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import TranslatedDoc from '../components/media/TranslatedDoc'
import {LANGUAGES, SANITY_API_VERSION} from '../constants'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Pages')
    .icon(DocumentsIcon)
    .schemaType('page')
    .child(
      S.list()
        .title('Pages')
        .items([
          ...LANGUAGES.map((language) =>
            S.listItem()
              .title(`Pages (${language.id.toLocaleUpperCase()})`)
              .schemaType('page')
              .icon(() => <TranslatedDoc icon={<DocumentsIcon />} languageIcon={language.icon} />)
              .child(
                S.documentList()
                  .id(language.id)
                  .title(`${language.title} Pages`)
                  .schemaType('page')
                  .apiVersion(SANITY_API_VERSION)
                  .filter('_type == "page" && language == $language')
                  .params({language: language.id})
                  .initialValueTemplates([
                    S.initialValueTemplateItem('page-language', {
                      id: 'page-language',
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
            .title(`All Pages`)
            .schemaType('page')
            .icon(DocumentsIcon)
            .child(
              S.documentList()
                .id(`all-pages`)
                .title(`All Pages`)
                .schemaType('page')
                .filter('_type == "page"')
                .apiVersion(SANITY_API_VERSION)
                .canHandleIntent(
                  (intentName, params) => intentName === 'edit' || params.template === `guide`
                )
            ),
        ])
    )
)
