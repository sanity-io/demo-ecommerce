import {EarthGlobeIcon} from '@sanity/icons'
import {Text} from '@sanity/ui'
import {ListItemBuilder} from 'sanity/desk'

import {LANGUAGES} from '../constants'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Guides')
    .icon(EarthGlobeIcon)
    .schemaType('guide')
    .child(
      S.list()
        .title('Guides')
        .items([
          ...LANGUAGES.map((language) =>
            S.listItem()
              .title(`Guides (${language.id.toLocaleUpperCase()})`)
              .schemaType('guide')
              .icon(() => <Text size={4}>{language.icon}</Text>)
              .child(
                S.documentList()
                  .id(language.id)
                  .title(`${language.title} Guides`)
                  .schemaType('guide')
                  .filter('_type == "guide" && language == $language')
                  .params({language: language.id})
                  .initialValueTemplates([
                    S.initialValueTemplateItem('guide-language', {
                      id: 'guide-language',
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
            .title(`All Guides`)
            .schemaType('guide')
            .icon(EarthGlobeIcon)
            .child(
              S.documentList()
                .id(`all-guides`)
                .title(`All Guides`)
                .schemaType('guide')
                .filter('_type == "guide"')
                .canHandleIntent(
                  (intentName, params) => intentName === 'edit' || params.template === `guide`
                )
            ),
        ])
    )
)
