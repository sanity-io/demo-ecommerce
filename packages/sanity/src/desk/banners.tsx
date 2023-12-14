import {StarIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import TranslatedDoc from '../components/media/TranslatedDoc'
import {LANGUAGES, SANITY_API_VERSION} from '../constants'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Banners')
    .icon(StarIcon)
    .schemaType('banner')
    .child(
      S.list()
        .title('Banners')
        .items([
          ...LANGUAGES.map((language) =>
            S.listItem()
              .title(`Banners (${language.id.toLocaleUpperCase()})`)
              .schemaType('banner')
              .icon(() => <TranslatedDoc icon={<StarIcon />} languageIcon={language.icon} />)
              .child(
                S.documentList()
                  .id(language.id)
                  .title(`${language.title} Banners`)
                  .schemaType('banner')
                  .apiVersion(SANITY_API_VERSION)
                  .filter('_type == "banner" && language == $language')
                  .params({language: language.id})
                  .initialValueTemplates([
                    S.initialValueTemplateItem('banner-language', {
                      id: 'banner-language',
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
            .title(`All Banners`)
            .schemaType('banner')
            .icon(StarIcon)
            .child(
              S.documentList()
                .id(`all-banners`)
                .title(`All Banners`)
                .schemaType('banner')
                .apiVersion(SANITY_API_VERSION)
                .filter('_type == "banner"')
                .canHandleIntent(
                  (intentName, params) => intentName === 'edit' || params.template === `banner`
                )
            ),
        ])
    )
)
