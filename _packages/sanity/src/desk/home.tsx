import {HomeIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import TranslatedDoc from '../components/media/TranslatedDoc'
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
              .icon(() => <TranslatedDoc icon={<HomeIcon />} languageIcon={language.icon} />)
              .id(`home-${language.id}`)
              .title(`Home (${language.id.toLocaleUpperCase()})`)
          ),
        ])
        .canHandleIntent(
          (intentName, params) => intentName === 'edit' && params.id.startsWith('home')
        )
    )
)
