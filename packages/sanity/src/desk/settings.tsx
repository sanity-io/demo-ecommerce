import {CogIcon} from '@sanity/icons'
import {Text} from '@sanity/ui'
import {ListItemBuilder} from 'sanity/desk'

import {LANGUAGES} from '../constants'
import defineStructure from '../utils/defineStructure'

// export default defineStructure<ListItemBuilder>((S) =>
//   S.listItem()
//     .title('Settings')
//     .schemaType('settings')
//     .child(S.editor().title('Settings').schemaType('settings').documentId('settings'))
// )

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Settings')
    .id('settings')
    .icon(CogIcon)
    .child(
      S.list()
        .title('Settings')
        .id('settings')
        .items([
          ...LANGUAGES.map((language) =>
            S.documentListItem()
              .schemaType(`settings`)
              .icon(() => <Text size={4}>{language.icon}</Text>)
              .id(`settings-${language.id}`)
              .title(`Settings (${language.id.toLocaleUpperCase()})`)
          ),
          S.divider(),
          S.listItem()
            .title('Shared Text')
            .schemaType('sharedText')
            .child(
              S.editor().title('Shared Text').schemaType('sharedText').documentId('sharedText')
            ),
        ])
        .canHandleIntent(
          (intentName, params) => intentName === 'edit' && params.id.startsWith('home')
        )
    )
)
