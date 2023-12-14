import {BoltIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import TranslatedDoc from '../components/media/TranslatedDoc'
import {LANGUAGES, SANITY_API_VERSION} from '../constants'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Landing Pages')
    .icon(BoltIcon)
    .schemaType('landingPage')
    .child(
      S.list()
        .title('Landing Pages')
        .items([
          ...LANGUAGES.map((language) =>
            S.listItem()
              .title(`Landing Pages (${language.id.toLocaleUpperCase()})`)
              .schemaType('landingPage')
              .icon(() => <TranslatedDoc icon={<BoltIcon />} languageIcon={language.icon} />)
              .child(
                S.documentList()
                  .id(language.id)
                  .title(`${language.title} Landing Pages`)
                  .schemaType('landingPage')
                  .apiVersion(SANITY_API_VERSION)
                  .filter('_type == "landingPage" && language == $language')
                  .params({language: language.id})
                  .initialValueTemplates([
                    S.initialValueTemplateItem('article-language', {
                      id: 'landingPage-language',
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
            .title(`All Landing Pages`)
            .schemaType('landingPage')
            .icon(BoltIcon)
            .child(
              S.documentList()
                .id(`all-landingPages`)
                .title(`All Landing Pages`)
                .schemaType('landingPage')
                .apiVersion(SANITY_API_VERSION)
                .filter('_type == "landingPage"')
                .canHandleIntent(
                  (intentName, params) => intentName === 'edit' || params.template === `landingPage`
                )
            ),
        ])
    )
)
