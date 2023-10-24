import {HomeIcon} from '@sanity/icons'
import {Text} from '@sanity/ui'
import {ListItemBuilder} from 'sanity/desk'

import {LANGUAGES} from '../constants'
import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Home')
    .id('home')
    .icon(HomeIcon)
    .child(
      S.list()
        .title('Home')
        .id('home')
        .items([
          ...LANGUAGES.map((language) =>
            S.documentListItem()
              .schemaType(`home`)
              .icon(() => <Text size={4}>{language.icon}</Text>)
              .id(`home-${language.id}`)
              .title(`Home (${language.id.toLocaleUpperCase()})`)
          ),
        ])
        .canHandleIntent(
          (intentName, params) => intentName === 'edit' && params.id.startsWith('home')
        )
    )
)
