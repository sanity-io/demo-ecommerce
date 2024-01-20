import {CogIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/structure'

import TranslatedDoc from '../components/media/TranslatedDoc'
import {LANGUAGES} from '../constants'
import defineStructure from '../utils/defineStructure'

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
              .icon(() => <TranslatedDoc icon={<CogIcon />} languageIcon={language.icon} />)
              .id(`settings-${language.id}`)
              .title(`Settings (${language.id.toLocaleUpperCase()})`),
          ),
          S.divider(),
          S.documentListItem()
            .title('Shared Text')
            .schemaType('sharedText')
            .child(
              S.editor().title('Shared Text').schemaType('sharedText').documentId('sharedText'),
            ),
        ])
        .canHandleIntent(
          (intentName, params) => intentName === 'edit' && params.id.startsWith('home'),
        ),
    ),
)
