import {DocumentsIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../utils/defineStructure'

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title('Pages')
    .icon(DocumentsIcon)
    .schemaType('page')
    .child(S.documentTypeList('page'))
)
