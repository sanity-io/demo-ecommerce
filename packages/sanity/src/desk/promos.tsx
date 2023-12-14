import {SparkleIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import TranslatedDoc from '../components/media/TranslatedDoc'
import {LANGUAGES, SANITY_API_VERSION} from '../constants'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Promos')
    .icon(SparkleIcon)
    .schemaType('promo')
    .child(
      S.list()
        .title('Promos')
        .items([
          ...LANGUAGES.map((language) =>
            S.listItem()
              .title(`Promos (${language.id.toLocaleUpperCase()})`)
              .schemaType('promo')
              .icon(() => <TranslatedDoc icon={<SparkleIcon />} languageIcon={language.icon} />)
              .child(
                S.documentList()
                  .id(language.id)
                  .title(`${language.title} Promos`)
                  .schemaType('promo')
                  .apiVersion(SANITY_API_VERSION)
                  .filter('_type == "promo" && language == $language')
                  .params({language: language.id})
                  .initialValueTemplates([
                    S.initialValueTemplateItem('promo-language', {
                      id: 'promo-language',
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
            .title(`All Promos`)
            .schemaType('promo')
            .icon(SparkleIcon)
            .child(
              S.documentList()
                .id(`all-promos`)
                .title(`All Promos`)
                .schemaType('promo')
                .apiVersion(SANITY_API_VERSION)
                .filter('_type == "promo"')
                .canHandleIntent(
                  (intentName, params) => intentName === 'edit' || params.template === `promo`
                )
            ),
        ])
    )
)
